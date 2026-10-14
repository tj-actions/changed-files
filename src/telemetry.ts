import * as core from '@actions/core'
import * as github from '@actions/github'
import {createHash} from 'crypto'

/**
 * Opt-in, anonymized telemetry for ApplySmart CI.
 *
 * Privacy guarantees:
 * - Strictly opt-in via the `telemetry` input or `TJ_ACTIONS_TELEMETRY=1`.
 * - No file paths, branch/tag names, commit content, PR titles, user handles,
 *   tokens, or environment variables are ever transmitted.
 * - Repository and owner identifiers are one-way SHA-256 hashes (truncated),
 *   so the receiver can group runs without learning the repo identity.
 * - Fire-and-forget with a short timeout; failures never affect the action.
 */

const SCHEMA_VERSION = 1
const DEFAULT_ENDPOINT = 'https://ci.applysmart.ai/api/v1/telemetry'
const SEND_TIMEOUT_MS = 2500

export type TelemetryStatus = 'success' | 'failure'

export interface TelemetryMetrics {
  durationMs: number
  status: TelemetryStatus
  changedFilesCount?: number
  addedCount?: number
  modifiedCount?: number
  deletedCount?: number
  renamedCount?: number
  usedRestApi?: boolean
}

function hashId(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}

export function isTelemetryEnabled(): boolean {
  // Explicit env override wins in either direction.
  const envFlag = process.env.TJ_ACTIONS_TELEMETRY
  if (envFlag === '1' || envFlag === 'true') return true
  if (envFlag === '0' || envFlag === 'false') return false

  try {
    return core.getBooleanInput('telemetry', {required: false})
  } catch {
    return false
  }
}

function normalizeOs(os: string | undefined): string {
  switch (os) {
    case 'Linux':
    case 'Windows':
    case 'macOS':
      return os
    default:
      return 'unknown'
  }
}

function detectRefType(): 'branch' | 'tag' | 'unknown' {
  const ref = process.env.GITHUB_REF || ''
  if (ref.startsWith('refs/tags/')) return 'tag'
  if (ref.startsWith('refs/heads/')) return 'branch'
  return 'unknown'
}

function detectVisibility(): 'public' | 'private' | 'internal' | 'unknown' {
  const visibility = (
    github.context.payload?.repository as {visibility?: string} | undefined
  )?.visibility
  const isPrivate = (
    github.context.payload?.repository as {private?: boolean} | undefined
  )?.private

  if (visibility === 'public' || visibility === 'private' || visibility === 'internal') {
    return visibility
  }
  if (typeof isPrivate === 'boolean') {
    return isPrivate ? 'private' : 'public'
  }
  return 'unknown'
}

function buildEvent(metrics: TelemetryMetrics): Record<string, unknown> {
  const repository = process.env.GITHUB_REPOSITORY || ''
  const [owner] = repository.split('/')

  return {
    schemaVersion: SCHEMA_VERSION,
    repoHash: repository ? hashId(repository) : 'unknown',
    ownerHash: owner ? hashId(owner) : 'unknown',
    runId: process.env.GITHUB_RUN_ID || undefined,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT
      ? parseInt(process.env.GITHUB_RUN_ATTEMPT, 10)
      : undefined,
    workflow: process.env.GITHUB_WORKFLOW || undefined,
    job: process.env.GITHUB_JOB || undefined,
    eventName: github.context.eventName || process.env.GITHUB_EVENT_NAME || undefined,
    refType: detectRefType(),
    repoVisibility: detectVisibility(),
    runnerOs: normalizeOs(process.env.RUNNER_OS),
    actionVersion: process.env.GITHUB_ACTION_REF || undefined,
    durationMs: Math.max(0, Math.round(metrics.durationMs)),
    changedFilesCount: metrics.changedFilesCount,
    addedCount: metrics.addedCount,
    modifiedCount: metrics.modifiedCount,
    deletedCount: metrics.deletedCount,
    renamedCount: metrics.renamedCount,
    usedRestApi: metrics.usedRestApi,
    status: metrics.status,
    ts: new Date().toISOString()
  }
}

/**
 * Sends a single telemetry event. Never throws; resolves regardless of outcome.
 */
export async function sendTelemetry(metrics: TelemetryMetrics): Promise<void> {
  if (!isTelemetryEnabled()) return

  const endpoint = process.env.APPLYSMART_TELEMETRY_URL || DEFAULT_ENDPOINT
  const event = buildEvent(metrics)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = {'Content-Type': 'application/json'}
    const ingestKey = process.env.APPLYSMART_TELEMETRY_KEY
    if (ingestKey) headers['X-ApplySmart-Key'] = ingestKey

    await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
      signal: controller.signal
    })
    core.debug('ApplySmart telemetry sent.')
  } catch (error) {
    // Telemetry must never break the action.
    core.debug(
      `ApplySmart telemetry skipped: ${
        error instanceof Error ? error.message : 'unknown error'
      }`
    )
  } finally {
    clearTimeout(timeout)
  }
}

# Security Policy

## Proactive Security Measures

To proactively detect and address security vulnerabilities, we utilize several robust tools and processes:

- **Dependency Updates:** We use [Renovate](https://renovatebot.com) and [Dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates) to keep our dependencies updated and promptly patch detected vulnerabilities through automated PRs.
- **[GitHub's Security Features](https://github.com/features/security):** Our repository and dependencies are continuously monitored via GitHub's security features, which include:
  - **Code Scanning:** Using GitHub's CodeQL, all pull requests are scanned to identify potential vulnerabilities in our source code.
  - **Automated Alerts:** Dependabot identifies vulnerabilities based on the GitHub Advisory Database and opens PRs with patches, while automated [secret scanning](https://docs.github.com/en/enterprise-cloud@latest/code-security/secret-scanning/about-secret-scanning#about-secret-scanning-for-partner-patterns) provides alerts for detected secrets.
- **[GitGuardian Security Checks](https://www.gitguardian.com/):** We employ GitGuardian to ensure security checks are performed on the codebase, enhancing the overall security of our project.
- **Code Analysis and Security Scanning:** With the help of [Codacy Static Code Analysis](https://www.codacy.com/) and [Codacy Security Scan](https://security.codacy.com/), we conduct thorough analyses and scans of our code for potential security risks.

## Reporting Security Vulnerabilities

Despite our best efforts to deliver secure software, we acknowledge the invaluable role of the community in identifying security breaches.

### Private Vulnerability Disclosures

We request all suspected vulnerabilities to be responsibly and privately disclosed by sending an email to [support@tj-actions.online](mailto:support@tj-actions.online).

### Public Vulnerability Disclosures

For publicly disclosed security vulnerabilities, please **IMMEDIATELY** email [support@tj-actions.online](mailto:support@tj-actions.online) with the details for prompt action.

Upon confirmation of a breach, reporters will receive full credit and recognition for their contribution. Please note, that we do not offer monetary compensation for reporting vulnerabilities.

## Communication of Security Breaches

We will utilize the [GitHub Security Advisory](https://github.com/tj-actions/changed-files/security/advisories) to communicate any security breaches. The advisory will be made public once a patch has been released to rectify the issue.

We appreciate your cooperation and contribution to maintaining the security of our software. Remember, a secure community is a strong community.

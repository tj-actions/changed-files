import {jest} from '@jest/globals'
import type {Inputs} from '../inputs.js'
import {DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS} from '../constant.js'

jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  getBooleanInput: jest.fn()
}))

const {getInputs} = await import('../inputs.js')
const core = await import('@actions/core')

describe('getInputs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return default values when no inputs are provided', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        '') as string
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should correctly parse boolean inputs', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        '') as string
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      switch (name) {
        case 'matrix':
          return true
        case 'skip_initial_fetch':
          return true
        default:
          return false
      }
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle matrix alias correctly', () => {
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      return name === 'matrix'
    })

    const inputs = getInputs()
    expect(inputs).toHaveProperty('json', true)
    expect(inputs).toHaveProperty('escapeJson', false)
  })

  test('should correctly parse string inputs', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case 'token':
          return 'token'
        case 'api_url':
          return 'https://api.github.com'
        default:
          return ''
      }
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should correctly parse numeric inputs', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case 'fetch_depth':
          return '5'
        case 'dir_names_max_depth':
          return '2'
        default:
          return ''
      }
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle invalid numeric inputs correctly', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      // TODO: Add validation for invalid numbers which should result in an error instead of NaN
      switch (name) {
        case 'fetch_depth':
          return 'invalid'
        case 'dir_names_max_depth':
          return '2'
        default:
          return ''
      }
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle negative numeric inputs correctly', () => {
    ;jest.mocked(core.getInput).mockImplementation((name: string) => {
      // TODO: Add validation for negative numbers which should result in an error
      switch (name) {
        case 'fetch_depth':
          return '-5'
        case 'dir_names_max_depth':
          return '-2'
        default:
          return ''
      }
    })
    ;jest.mocked(core.getBooleanInput).mockImplementation((name: string) => {
      const camelCaseName = name.replace(/_([a-z])/g, (_: string, g: string) => {
        return g.toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })
})

import * as core from '@actions/core'
import {getInputs, Inputs} from '../inputs'
import {DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS} from '../constant'

jest.mock('@actions/core')

describe('getInputs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return default values when no inputs are provided', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        '') as string
    })
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should correctly parse boolean inputs', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        '') as string
    })
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      switch (name) {
        case 'matrix':
          return 'true'
        case 'skip_initial_fetch':
          return 'true'
        default:
          return 'false'
      }
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle matrix alias correctly', () => {
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      return name === 'matrix' ? 'true' : 'false'
    })

    const inputs = getInputs()
    expect(inputs).toHaveProperty('json', true)
    expect(inputs).toHaveProperty('escapeJson', false)
  })

  test('should correctly parse string inputs', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
      switch (name) {
        case 'token':
          return 'token'
        case 'api_url':
          return 'https://api.github.com'
        default:
          return ''
      }
    })
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should correctly parse numeric inputs', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
      switch (name) {
        case 'fetch_depth':
          return '5'
        case 'dir_names_max_depth':
          return '2'
        default:
          return ''
      }
    })
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle invalid numeric inputs correctly', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
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
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })

  test('should handle negative numeric inputs correctly', () => {
    ;(core.getInput as jest.Mock).mockImplementation(name => {
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
    ;(core.getBooleanInput as jest.Mock).mockImplementation(name => {
      const camelCaseName = name.replace(/_([a-z])/g, (g: string[]) => {
        return g[1].toUpperCase()
      }) as keyof Inputs

      return (DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS[camelCaseName] ||
        false) as boolean
    })
    expect(getInputs()).toMatchSnapshot()
  })
})

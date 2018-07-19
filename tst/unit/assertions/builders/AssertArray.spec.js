/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'

import AssertArray from '../../../../src/assertions/builders/AssertArray'
import { OPTIMIZED, assertOptimized } from '../../../../src/assertions/types'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('AssertArray', () => {
  const typeSchema = { type: 'array', [OPTIMIZED]: AssertArray.optimize({ type: 'array' }) }
  let assertions

  afterEach(() => {
    assertions = null
  })

  describe('type keyword', () => {
    const schema = { type: 'array' }

    beforeEach(() => (assertions = AssertArray.optimize(schema)))

    it('should create optimized assertions successfully', () => {
      expect(assertions).to.be.an('array')
      expect(assertions.length).to.equal(1)
      expect(assertions[0]).to.be.a('function')
    })

    it('should assert optimized with valid value successfully', () => {
      expect(assertOptimized([], schema, assertions)).to.be.undefined()
    })

    it('should assert optimized with invalid value unsuccessfully', () => {
      const error = assertOptimized(null, schema, assertions)
      expect(error.message).to.equal('#type: value is not an array')
    })
  })

  describe('items keyword', () => {
    context('as a schema', () => {
      const schema = { items: typeSchema }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid value successfully', () => {
        expect(assertOptimized([[]], schema, assertions)).to.be.undefined()
      })

      it('should assert optimized with invalid value unsuccessfully', () => {
        const error = assertOptimized([null], schema, assertions)
        expect(error.message).to.equal('#type: value is not an array')
      })
    })

    context('as an array of schemas', () => {
      const schema = { items: [typeSchema, typeSchema] }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid values successfully', () => {
        expect(assertOptimized([[]], schema, assertions)).to.be.undefined()
        expect(assertOptimized([[], []], schema, assertions)).to.be.undefined()
        expect(assertOptimized([[], [], []], schema, assertions)).to.be.undefined()
      })

      it('should assert optimized with invalid value unsuccessfully', () => {
        const error = assertOptimized([null, null], schema, assertions)
        expect(error.message).to.equal('#type: value is not an array')
      })
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ items: null })
      } catch (e) {
        expect(e.message).to.equal('#items: must be either a Schema or an Array of Schemas')
      }
    })
  })

  describe('additionalItems keyword', () => {
    context('as a boolean', () => {
      const schema = { items: [typeSchema], additionalItems: false }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid values successfully', () => {
        expect(assertOptimized([[]], schema, assertions)).to.be.undefined()
      })

      it('should assert optimized with invalid value unsuccessfully', () => {
        const error = assertOptimized([[], []], schema, assertions)
        expect(error.message).to.equal('#additionalItems: \'1\' additional items not allowed')
      })
    })

    context('as a schema', () => {
      const schema = { items: [typeSchema], additionalItems: typeSchema }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid values successfully', () => {
        expect(assertOptimized([[]], schema, assertions)).to.be.undefined()
        expect(assertOptimized([[], []], schema, assertions)).to.be.undefined()
      })

      it('should assert optimized with invalid value unsuccessfully', () => {
        const error = assertOptimized([[], null], schema, assertions)
        expect(error.message).to.equal('#type: value is not an array')
      })
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ items: [{}], additionalItems: null })
      } catch (e) {
        expect(e.message).to.equal('#additionalItems: must be either a Schema or Boolean')
      }
    })
  })

  describe('contains keyword', () => {
    const schema = { contains: typeSchema }

    beforeEach(() => (assertions = AssertArray.optimize(schema)))

    it('should create optimized assertions successfully', () => {
      expect(assertions).to.be.an('array')
      expect(assertions.length).to.equal(1)
      expect(assertions[0]).to.be.a('function')
    })

    it('should assert optimized with valid values successfully', () => {
      expect(assertOptimized([1, []], schema, assertions)).to.be.undefined()
      expect(assertOptimized([[], 2], schema, assertions)).to.be.undefined()
    })

    it('should assert optimized with invalid values unsuccessfully', () => {
      let error = assertOptimized([1, 2], schema, assertions)
      expect(error.message).to.equal('#contains: value does not contain element matching the Schema')

      error = assertOptimized([], schema, assertions)
      expect(error.message).to.equal('#contains: value does not contain element matching the Schema')
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ contains: null })
      } catch (e) {
        expect(e.message).to.equal('#contains: keyword should be a Schema')
      }
    })
  })

  describe('maxItems keyword', () => {
    const schema = { maxItems: 1 }

    beforeEach(() => (assertions = AssertArray.optimize(schema)))

    it('should create optimized assertions successfully', () => {
      expect(assertions).to.be.an('array')
      expect(assertions.length).to.equal(1)
      expect(assertions[0]).to.be.a('function')
    })

    it('should assert optimized with valid value successfully', () => {
      expect(assertOptimized([], schema, assertions)).to.be.undefined()
    })

    it('should assert optimized with invalid value unsuccessfully', () => {
      const error = assertOptimized([1, 2], schema, assertions)
      expect(error.message).to.equal('#maxItems: value maximum exceeded')
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ maxItems: null })
      } catch (e) {
        expect(e.message).to.equal('#maxItems: keyword must be a positive integer')
      }
    })
  })

  describe('minItems keyword', () => {
    const schema = { minItems: 1 }

    beforeEach(() => (assertions = AssertArray.optimize(schema)))

    it('should create optimized assertions successfully', () => {
      expect(assertions).to.be.an('array')
      expect(assertions.length).to.equal(1)
      expect(assertions[0]).to.be.a('function')
    })

    it('should assert optimized with valid value successfully', () => {
      expect(assertOptimized([1], schema, assertions)).to.be.undefined()
    })

    it('should assert optimized with invalid value unsuccessfully', () => {
      const error = assertOptimized([], schema, assertions)
      expect(error.message).to.equal('#minItems: value minimum not met')
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ minItems: null })
      } catch (e) {
        expect(e.message).to.equal('#minItems: keyword must be a positive integer')
      }
    })
  })

  describe('uniqueItems keyword', () => {
    const schema = { uniqueItems: true }

    beforeEach(() => (assertions = AssertArray.optimize(schema)))

    it('should create optimized assertions successfully', () => {
      expect(assertions).to.be.an('array')
      expect(assertions.length).to.equal(1)
      expect(assertions[0]).to.be.a('function')
    })

    it('should assert optimized with valid primitive values successfully', () => {
      expect(assertOptimized([1, 2], schema, assertions)).to.be.undefined()
      expect(assertOptimized([schema, 1], schema, assertions)).to.be.undefined()
    })

    it('should assert optimized with invalid primitive values unsuccessfully', () => {
      let error = assertOptimized([1, 1], schema, assertions)
      expect(error.message).to.equal('#uniqueItems: value does not contain unique items')

      error = assertOptimized([schema, schema], schema, assertions)
      expect(error.message).to.equal('#uniqueItems: value does not contain unique items')
    })

    it('should throw an error on invalid type', () => {
      try {
        assertions = AssertArray.optimize({ uniqueItems: null })
      } catch (e) {
        expect(e.message).to.equal('#minItems: keyword must be a positive integer')
      }
    })
  })

  describe('complex array schemas', () => {
    context('with enforced type', () => {
      const schema = { type: 'array', maxItems: 3, minItems: 1 }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid value successfully', () => {
        expect(assertOptimized([1], schema, assertions)).to.be.undefined()
      })

      it('should assert optimized with invalid value unsuccessfully', () => {
        const error = assertOptimized(null, schema, assertions)
        expect(error.message).to.equal('#type: value is not an array')
      })
    })

    context('without enforced type', () => {
      const schema = { maxItems: 3, minItems: 1 }

      beforeEach(() => (assertions = AssertArray.optimize(schema)))

      it('should create optimized assertions successfully', () => {
        expect(assertions).to.be.an('array')
        expect(assertions.length).to.equal(1)
        expect(assertions[0]).to.be.a('function')
      })

      it('should assert optimized with valid values successfully', () => {
        expect(assertOptimized([1], schema, assertions)).to.be.undefined()
        expect(assertOptimized(null, schema, assertions)).to.be.undefined()
      })
    })
  })
})

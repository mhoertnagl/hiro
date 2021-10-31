import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as strings from '@/utils/strings'
// import * as strings from '../src/utils/strings'

describe('ensurePrefix', () => {
  it('should add the missing prefix', () => {
    expect(strings.ensurePrefix('x', '.')).to.be.equal('.x')
  })

  it('not add the preexisting prefix', () => {
    expect(strings.ensurePrefix('.x', '.')).to.be.equal('.x')
  })
})

// // https://medium.com/swlh/how-to-setting-up-unit-tests-with-typescript-871c0f4f1609
// import { suite, test } from '@testdeck/mocha'
// import * as chai from 'chai'
// // import { mock, instance } from 'ts-mockito'
// import * as strings from '../src/utils/strings'

// // chai.should()

// @suite
// class StringsTest {
//   before() {}

//   @test 'ensurePrefix should add the missing prefix'() {
//     chai.expect(strings.ensurePrefix('x', '.')).to.be.equal('.x')
//   }

//   @test 'ensurePrefix should not add the preexisting prefix'() {
//     chai.expect(strings.ensurePrefix('.x', '.')).to.be.equal('.x')
//   }
// }

import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as paths from '@/utils/file-paths'

describe('ext', () => {
  it('should replace the extension of a file in a path', () => {
    expect(paths.ext('/foo/bar.md', '.html')).to.be.equal('\\foo\\bar.html')
  })

  it('should replace the extension without . of a file in a path', () => {
    expect(paths.ext('/foo/bar.md', 'html')).to.be.equal('\\foo\\bar.html')
  })
})

describe('name', () => {
  it('should replace the name of a file in a path', () => {
    expect(paths.name('/foo/bar.md', 'baz')).to.be.equal('\\foo\\baz.md')
  })
})

describe('dir', () => {
  it('should replace the directory in a path', () => {
    expect(paths.dir('/foo/bar', '/baz')).to.be.equal('\\baz\\bar')
  })

  it('should replace the directory in a path', () => {
    expect(paths.dir('/foo/bar.md', '/baz')).to.be.equal('\\baz\\bar.md')
  })

  it('should replace the directory in a path', () => {
    expect(paths.dir('/foo/bar.md', '/baz/fup')).to.be.equal(
      '\\baz\\fup\\bar.md'
    )
  })

  it('should replace the directory in a path with a list of dirs', () => {
    expect(paths.dir('/foo/bar.md', '/baz', 'fup')).to.be.equal(
      '\\baz\\fup\\bar.md'
    )
  })

  it('should replace the directory in a path with a list of dirs', () => {
    expect(paths.dir('/foo/bar.md', '/baz', 'fup/hui')).to.be.equal(
      '\\baz\\fup\\hui\\bar.md'
    )
  })
})

describe('subdir', () => {
  it('should add a subdirectory in a path', () => {
    expect(paths.subdir('/foo/bar', '/baz')).to.be.equal('\\foo\\baz\\bar')
  })

  it('should add a subdirectory in a path', () => {
    expect(paths.subdir('/foo/bar.md', '/baz')).to.be.equal(
      '\\foo\\baz\\bar.md'
    )
  })

  it('should add subdirectories in a path', () => {
    expect(paths.subdir('/foo/bar.md', '/baz', 'fup')).to.be.equal(
      '\\foo\\baz\\fup\\bar.md'
    )
  })

  it('should add subdirectories in a path', () => {
    expect(paths.subdir('/foo/bar.md', '/baz', 'fup/hui')).to.be.equal(
      '\\foo\\baz\\fup\\hui\\bar.md'
    )
  })
})

describe('superdir', () => {
  it('should add a superdirectory in a path', () => {
    expect(paths.superdir('/foo/bar', '/baz')).to.be.equal('\\baz\\foo\\bar')
  })

  it('should add a superdirectory in a path', () => {
    expect(paths.superdir('/foo/bar.md', '/baz')).to.be.equal(
      '\\baz\\foo\\bar.md'
    )
  })

  it('should add superdirectory in a path', () => {
    expect(paths.superdir('/foo/bar.md', '/baz', 'fup')).to.be.equal(
      '\\baz\\fup\\foo\\bar.md'
    )
  })

  it('should add superdirectory in a path', () => {
    expect(paths.superdir('/foo/bar.md', '/baz', 'fup/hui')).to.be.equal(
      '\\baz\\fup\\hui\\foo\\bar.md'
    )
  })
})

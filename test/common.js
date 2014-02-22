
var co = require('co');
var assert = require('assert');
var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');

var Downloader = require('..');

var join = path.join;

describe('When downloading via fields', function () {
  test(false);
})

describe('When downloading archives', function () {
  test(true);
})

function test(archive) {
  var downloader = Downloader({
    archive: archive
  });

  it('should cleanup the components folder', function (done) {
    rimraf(join(process.cwd(), 'components'), done);
  })

  describe('.download(repo, ref)', function () {
    it('should download component/emitter@1.1.2', co(function* () {
      var repo = 'component/emitter';
      var ref = '1.1.2';
      var folder = downloader.folder(repo, ref);
      yield* downloader.download(repo, ref);
      assert.ok(fs.existsSync(folder));
      assert.ok(fs.existsSync(join(folder, 'component.json')));
      assert.ok(fs.existsSync(join(folder, 'index.js')));

      if (archive) {
        assert.ok(fs.existsSync(join(folder, 'Makefile')));
        assert.ok(fs.existsSync(join(folder, 'package.json')));
      }
    }))

    it('should download component/domify@master', co(function* () {
      var repo = 'component/domify';
      var ref = 'master';
      var folder = downloader.folder(repo, ref);
      yield* downloader.download(repo, ref);
      assert.ok(fs.existsSync(folder));
      assert.ok(fs.existsSync(join(folder, 'component.json')));
      assert.ok(fs.existsSync(join(folder, 'index.js')));

      if (archive) {
        assert.ok(fs.existsSync(join(folder, 'Makefile')));
        assert.ok(fs.existsSync(join(folder, 'package.json')));
      }
    }))

    it('should unglob component-test/glob@0.0.1', co(function* () {
      var repo = 'component-test/glob';
      var ref = '0.0.1';
      var folder = downloader.folder(repo, ref);
      yield* downloader.download(repo, ref);
      assert.ok(fs.existsSync(folder));
      assert.ok(fs.existsSync(join(folder, 'component.json')));
      assert.ok(fs.existsSync(join(folder, 'lib/index.js')));
      assert.ok(fs.existsSync(join(folder, 'lib/index.css')));

      var json = require(join(folder, 'component.json'));
      json.scripts.should.eql(['lib/index.js']);
      json.styles.should.eql(['lib/index.css']);
    }))
  })
}
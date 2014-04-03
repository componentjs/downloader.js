
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
  var download = Downloader({
    archive: archive
  });

  before(function (done) {
    rimraf(join(process.cwd(), 'components'), done);
  })

  describe('.download(repo, ref)', function () {
    it('should download component/emitter@1.1.2', co(function* () {
      var repo = 'component/emitter';
      var ref = '1.1.2';
      var folder = download.downloader.folder(repo, ref);
      yield* download(repo, ref);
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
      var folder = download.downloader.folder(repo, ref);
      yield* download(repo, ref);
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
      var folder = download.downloader.folder(repo, ref);
      yield* download(repo, ref);
      assert.ok(fs.existsSync(folder));
      assert.ok(fs.existsSync(join(folder, 'component.json')));
      assert.ok(fs.existsSync(join(folder, 'lib/index.js')));
      assert.ok(fs.existsSync(join(folder, 'lib/index.css')));

      var json = require(join(folder, 'component.json'));
      json.scripts.should.eql(['lib/index.js']);
      json.styles.should.eql(['lib/index.css']);
    }))

    it('should download rogerz/d3-cloud-for-angular@d3221b5e2e0d6fe8864e0c48de14cabf5674be1e', co(function* () {
      // https://github.com/component/component/issues/438
      var repo = 'rogerz/d3-cloud-for-angular';
      var ref = 'd3221b5e2e0d6fe8864e0c48de14cabf5674be1e';
      var folder = download.downloader.folder(repo, ref);
      yield* download(repo, ref);
      assert.ok(fs.existsSync(join(folder, 'component.json')));
      assert.ok(fs.existsSync(join(folder, 'images/20%.png')));
    }))
  })
}
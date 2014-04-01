
var rimraf = require('rimraf');
var utils = require('component-consoler');
var debug = require('debug')('component-downloader');

var Downloader = require('./downloader');

Downloader.prototype.download = function* (remotes, repo, ref, archive) {
  if (!Array.isArray(remotes)) {
    archive = ref;
    ref = repo;
    repo = remotes;
    remotes = null;
  }

  repo = repo.toLowerCase();
  var folder = this.folder(repo, ref);
  if (yield* this.exists(folder)) return debug('"%s" exists, skipping downloading.', folder);

  var start = Date.now();

  if (typeof archive !== 'boolean') archive = this.archive;
  process.on('exit', onexit);
  try {
    if (archive) {
      yield* this._byArchive(remotes, repo, ref);
    } else {
      yield* this._byFields(remotes, repo, ref);
    }
  } catch (err) {
    // delete the folder on errors
    yield rimraf.bind(null, folder);
    throw err;
  }
  process.removeListener('exit', onexit);

  var elapsed = Date.now() - start;
  debug('installed %s@%s in %sms', repo, ref, elapsed);
  if (this.verbose) utils.log('installed', repo + '@' + ref + ' in ' + elapsed + 'ms');

  // delete folders on premature exits
  function onexit() {
    rimraf.sync(folder);
  }
}
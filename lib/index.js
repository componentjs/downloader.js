
var rimraf = require('rimraf');
var debug = require('debug')('component-downloader');

var Downloader = module.exports = require('./downloader');
require('./fields');
require('./archive');

Downloader.prototype.download = function* (remotes, repo, ref, archive) {
  if (!Array.isArray(remotes)) {
    archive = ref;
    ref = repo;
    repo = remotes;
    remotes = null;
  }

  repo = repo.toLowerCase();
  var folder = this.folder(repo, ref);
  if (yield* this.exists(folder)) return;

  var start = Date.now();
  if (this.verbose) {
    console.log('\033[90m  <-- installing \033[96m%s@%s\033[90m...\033[0m', repo, ref);
  }

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
  if (this.verbose) {
    console.log('\033[90m  --> installed  \033[96m%s@%s\033[90m \033[90min \033[33m%sms\033[0m', repo, ref, elapsed);
  }

  // delete folders on premature exits
  function onexit() {
    rimraf.sync(folder);
  }
}
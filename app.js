const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function git_pull(goPath, importPath) {
    var git = cp.spawnSync('git', ['pull'], {
        // cwd: goPath + 'src/' + importPath
        cwd: path.join(goPath, 'src', importPath),
        stdio: 'inherit'
    });

    return;

    git.stdout.on('data', d => {
        console.log(d.toString());
    });

    git.stderr.on('data', d => {
        console.log(`git stderr: ${ d }`);
    });

    git.on('close', c => {
        if (c !== 0) {
            console.log(`git process exited with code ${ c }`);
        }
    });
}

var fileName = '/src.json';

fs.readFile(__dirname + fileName, (err, buff) => {
    if (err) throw err;

    // 获取所有源码记录。
    let go_src = JSON.parse(buff.toString('utf8'));

    // 获取 GOPATH 路径。
    let go_path = go_src['gopath'];
    console.log(go_path);

    // 获取所有源码路径。
    let go_lib = go_src['golib'];
    console.table(go_lib);

    go_lib.forEach((v, i) => {
        console.log(i + 1 + '. ' + v['import']);
        git_pull(go_path, v['import']);
    });

});

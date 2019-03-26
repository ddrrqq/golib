const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const url = require('url')

function git_clone(goPath, importPath, srcPath) {
    let author = importPath.substring(0, importPath.lastIndexOf('/'));
    let git = cp.spawn('git', ['clone', '--depth', '1'], {
        cwd: path.join(goPath, author)
    });
}

/**
 * 执行 Git 拉取命令。
 * @param {String} goPath GOPATH 路径。
 * @param {String} importPath import 指令路径。
 */
function git_pull(goPath, importPath) {
    let git = cp.spawnSync('git', ['pull'], {
        // cwd: goPath + 'src/' + importPath
        cwd: path.join(goPath, 'src', importPath),
        stdio: 'inherit'
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

        if (v['cmd']) {
            console.log('编译');
        }
    });

});

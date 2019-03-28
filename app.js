const path = require('path');
const fs = require('fs');
const git = require('./git');

const SRC_FILE = '/src.json';

fs.readFile(__dirname + SRC_FILE, (err, buff) => {
    if (err) throw err;

    // 获取所有源码记录。
    let goSrc = JSON.parse(buff.toString('utf8'));

    // 获取 GOPATH 路径。
    let goPath = goSrc['gopath'];
    console.log(goPath);

    // 获取所有源码路径。
    let goLibs = goSrc['golib'];
    console.table(goLibs);

    goLibs.forEach((v, i) => {
        let importPath = v['import'];
        console.log(`${ i + 1 }. ${ importPath }`);

        if (!fs.existsSync(path.join(goPath, 'src', importPath, '.git'))) {
            console.log('不存在');
            git.get(goPath, importPath, v['src']);
        }
        // git.get(goPath, v['import'], v['src']);

        if (v['cmd']) {
            console.log('[编译]');
        }
    });
});

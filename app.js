#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const git = require('./git');

const SRC_FILE = '/src.json';

fs.readFile(__dirname + SRC_FILE, (err, buff) => {
    if (err) throw err;

    // 获取所有源码包记录。
    let goSrc = JSON.parse(buff.toString('utf8'));

    // 获取 GOPATH 路径。
    let goPath = goSrc['gopath'];

    // 获取所有源码包路径。
    let goLibs = goSrc['golib'];

    // 遍历并更新每一个源码包。
    goLibs.forEach((v, i) => {
        let importPath = v['import'];
        console.log(`${ i + 1 }. ${ importPath }`);

        fs.existsSync(path.join(goPath, 'src', importPath, '.git')) ?
            git.upgrade(goPath, importPath) :
            git.get(goPath, importPath, v['src']);

        v['build'] && git.build(importPath, v['cmd']);
    });

    console.info('Upgrade Complete!');
});

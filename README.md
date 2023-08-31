### Dependency Diff

generate [DOT](https://graphviz.org/doc/info/lang.html "DOT") diagrams showing the code level dependency diff between two versions of a git repository

You can visualize the output either with a [cmd](https://graphviz.org/doc/info/command.html "cmd") tool or [online](https://dreampuf.github.io/GraphvizOnline/ "online")


### Setup
It is expected you have a git binary.

You need to setup [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser "dependency-cruiser") in your project as this is what generates the dependencies.

    npm i --save-dev dependency-cruiser
    npx depcruise --init
	npm i --save-dev @stanimirovv/dependency-diff

Verify dependency-cruiser is correctly installed (assumes your code is src, see [dependency-cruiser docs](https://www.npmjs.com/package/dependency-cruiser "dependency-cruiser") for more info)

    npx depcruise src --include-only "^src" --output-type dot

Finally, add a script to your `package.json` that `dependency-diff` will call:
      "depcruise-report": "npx depcruise src --include-only \"^src\" --output-type json"

**! Depending on your project's structure this might be a different script**

### Usage
    npx dependency-diff <branch A> <branch B>


export class buildQuery {
    static getQueryArgs(argsArr: any[], currentIndex: number): QueryArguments {
        let args = "";
        argsArr.forEach(argItem => {
            if (currentIndex > 0) {
                args += ", ";
            }
            args += "$" + (currentIndex + 1);
            currentIndex++;
        });

        return {
            ParamArgs: args,
            CurrentIndex: currentIndex,
        }
    }
}

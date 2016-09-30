import { Loader } from 'aurelia-loader';

export declare class Configure {
    loader: Loader;
    environment: string;
    environments: any;
    directory: string;
    config_file: string;
    cascade_mode: boolean;
    private _config_object;
    private _config_merge_object;
    constructor(loader: Loader);
    setDirectory(path: any): void;
    setConfig(name: any): void;
    setEnvironment(environment: any): void;
    setEnvironments(environments?: boolean): void;
    setCascadeMode(bool?: boolean): void;
    readonly obj;
    readonly config: string;
    is(environment: any): boolean;
    check(): void;
    environmentEnabled(): boolean;
    environmentExists(): boolean;
    get(key: any, defaultValue?: any): any;
    set(key: any, val: any): void;
    merge(obj: any): void;
    lazyMerge(obj: any): void;
    setAll(obj: any): void;
    getAll();
    loadConfig(): Promise<void>;
    loadConfigFile(path: any, action: any): Promise<void>;
    mergeConfigFile(path: any): Promise<void>;
}

export declare function configure(aurelia: any, configCallback: any): Promise<{}>;

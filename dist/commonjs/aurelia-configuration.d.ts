export declare class AureliaConfiguration {
    private environment;
    private environments;
    private directory;
    private config_file;
    private cascade_mode;
    private _config_object;
    private _config_merge_object;
    setDirectory(path: string): void;
    setConfig(name: string): void;
    setEnvironment(environment: string): void;
    setEnvironments(environments?: any): void;
    setCascadeMode(bool?: boolean): void;
    readonly obj: any;
    readonly config: string;
    is(environment: string): boolean;
    check(): void;
    environmentEnabled(): boolean;
    environmentExists(): boolean;
    get(key: string, defaultValue?: any): any;
    set(key: string, val: string): void;
    merge(obj: {} | any): void;
    lazyMerge(obj: {} | any): void;
    setAll(obj: {} | any): void;
    getAll(): any;
    loadConfig(): Promise<void>;
    loadConfigFile(path: string, action: Function): Promise<{}>;
    mergeConfigFile(path: string, optional: boolean): Promise<{}>;
}

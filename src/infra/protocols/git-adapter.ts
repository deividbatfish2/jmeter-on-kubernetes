export interface GitAdapterModel {
    path: string
}

export interface GitAdapter {
    clone: (projetcToClone: GitAdapterModel) => Promise<void | Error>
}
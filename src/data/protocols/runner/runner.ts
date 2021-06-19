export interface RunnerModel {
    pathOfProject: string
    totalOfRunners: number
}

export interface Runner {
    runProject: ({ pathOfProject, totalOfRunners }: RunnerModel) => Promise<Error>
}
export interface RunLoadProjectModel {
  idProject: string
  qtdRunners: number
}

export interface RunLoadProject {
  run: (runLoadProjectModel: RunLoadProjectModel) => Promise<Error>
}

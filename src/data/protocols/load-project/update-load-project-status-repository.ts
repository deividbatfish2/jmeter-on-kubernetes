import { LoadProjectModel } from "../../../domain/models/load-project-model";
import { StatusProject } from "../../../domain/models/status-project";

export interface UpdateLoadProjecStatusModel {
    id: string
    status: StatusProject
}

export interface UpdateLoadProjectStatusRepository {
    updateStatus: (updateStatusModel: UpdateLoadProjecStatusModel) => Promise<void | Error>
}
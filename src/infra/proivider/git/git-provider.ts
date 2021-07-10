import { JmxProvider } from "../../../data/protocols/jmx-provider/JmxProvider";
import { GitAdapter } from "../../protocols/git-adapter";

export class GitProvider implements JmxProvider {
    constructor(private readonly gitAdapter: GitAdapter) { }

    async getProject(specificFields: any): Promise<string | Error> {
        await this.gitAdapter.clone({ path: specificFields.path })
        return null
    }
}
import { GitAdapter, GitAdapterModel } from "../../protocols/git-adapter"
import { GitProvider } from "./git-provider"

describe('GitProvider', () => {
    test('Should call GitAdapter with correct values', async () => {
        class GitAdaperStub implements GitAdapter {
            async clone(projetcToClone: GitAdapterModel): Promise<void | Error> {
                return
            }
        }
        const gitAdapterStub = new GitAdaperStub()
        const cloneSpy = jest.spyOn(gitAdapterStub, 'clone')

        const gitProvider = new GitProvider(gitAdapterStub)

        await gitProvider.getProject({ path: 'https://any_path' })

        expect(cloneSpy).toHaveBeenCalledWith({ path: 'https://any_path' })
    })
})
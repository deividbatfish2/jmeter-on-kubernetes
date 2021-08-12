import { GitAdapter, GitAdapterModel } from "../../protocols/git-adapter"
import { GitProvider } from "./git-provider"

const makeGitAdapterStub = (): GitAdapter => {
    class GitAdaperStub implements GitAdapter {
        async clone(projetcToClone: GitAdapterModel): Promise<void | Error> {
            return
        }
    }
    return new GitAdaperStub()
}

interface SutTypes {
    gitAdapterStub: GitAdapter
    sut: GitProvider
}

const makeSut = (): SutTypes => {
    const gitAdapterStub = makeGitAdapterStub()
    const sut = new GitProvider(gitAdapterStub)

    return {
        gitAdapterStub, sut
    }
}
describe('GitProvider', () => {
    test('Should call GitAdapter with correct values', async () => {

        const { gitAdapterStub, sut } = makeSut()
        const cloneSpy = jest.spyOn(gitAdapterStub, 'clone')

        await sut.getProject({ path: 'https://any_path' })

        expect(cloneSpy).toHaveBeenCalledWith({ path: 'https://any_path' })
    })

    test('Should throw if GitAdapter trows', async () => {
        const { gitAdapterStub, sut } = makeSut()
        jest.spyOn(gitAdapterStub, 'clone').mockImplementationOnce(() => { throw new Error('any error') })

        const error = sut.getProject({ path: 'https://any_path' })

        await expect(error).rejects.toThrowError('any error')
    })
})
function getModePath(name: string, mode: string, local: boolean) {
    return `${name}${mode ? `.${mode}` : ''}${local ? '.local' : ''}`
}

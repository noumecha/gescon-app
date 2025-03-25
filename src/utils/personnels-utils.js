const formatPersonnelName = (s, name) => {
    if (s === 'M')
        return 'M. ' + name
    else
        return 'Mme ' + name
}

export { formatPersonnelName };
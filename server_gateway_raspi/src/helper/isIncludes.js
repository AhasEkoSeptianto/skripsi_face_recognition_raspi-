exports.IsIncludes = (value) => {
    return { '$regex': (value + '') }
}
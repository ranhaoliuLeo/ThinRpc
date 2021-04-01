isTheBest = {
    m_code: 0,
    req: {
        name: "string|1",
        age: "int|2",
        sex: "bool|3",
        number: "string|4"
    },
    res: {
        comment: "string|1"
    }
}

comment = {
    m_code: 1,
    req: {
        title: "string|1",
        body: "string|2"
    },
    res: {
        ret: "bool|1"
    }
}

module.exports = {
    isTheBest,
    comment
}
async function paginate(Model, filter = {}, options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const sort = options.sort || {};
    const populate = options.populate || [];

    const skip = (page - 1) * limit;

    // Đếm tổng documents theo filter
    const totalDocs = await Model.countDocuments(filter);

    // Tính tổng trang
    const totalPages = Math.ceil(totalDocs / limit);

    // Tạo query
    let query = Model.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort);

    // Nếu có populate, thực hiện populate
    if (populate.length > 0) {
        populate.forEach((pop) => {
            query = query.populate(pop);
        });
    }

    // Thực hiện truy vấn
    const docs = await query.exec();

    return {
        docs,
        totalDocs,
        totalPages,
        currentPage: page,
        perPage: limit,
    };
}

export default paginate

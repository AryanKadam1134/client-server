export const paginateQuery = async ({
  model,
  page = 1,
  limit = 10,
  filter = {},
  sort = { createdAt: -1 },
  populate = "",
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

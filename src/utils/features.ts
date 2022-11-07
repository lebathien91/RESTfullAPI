export const featureAPI = class {
  constructor(public query: any, public queryString: any) {}

  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["page", "limit", "sort", "search", "populate"];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    queryStr = JSON.parse(queryStr);

    this.query.find(queryStr);

    return this;
  }

  searching() {
    const search = this.queryString.search;

    if (search) {
      this.query = this.query.find({ $text: { $search: search } });
    } else {
      this.query = this.query.find();
    }
    return this;
  }

  populated() {
    const populate = this.queryString.populate;
    this.query = this.query.populate(populate);
    return this;
  }

  counting() {
    this.query = this.query.count();
    return this;
  }

  sorting() {
    const sort = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  }

  paginating() {
    const limit = this.queryString.limit * 1 || 10;
    const page = this.queryString.page * 1 || 1;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
};

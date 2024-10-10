"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieServices = void 0;
const movie_model_1 = require("./movie.model");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const movie_constants_1 = require("./movie.constants");
const createMovie = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    Way1: Using business logic here....
  
     title - releaseDate
     WE will get: Inception Two 2010-07-16T00:00:00.000Z
     We want:  inception-two -2010-07-16
      
     const date = format(payload.releaseDate, "dd-MM-yyyy");
  
     //creating slug
     const slug = slugify(`${payload.title}-${date}}`, {
         lower: true,
     });
     //const result = await Movie.create(payload);
  */
    /* Way3: Using instance method logic here....
  
    
    const result = new Movie(payload);
    
    const slug = result.createSlug(payload);
    
    result.slug = slug;
    await result.save(); // database save
  
    return result;
    */
    const result = new movie_model_1.Movie(payload);
    const slug = result.createSlug(payload);
    result.slug = slug;
    yield result.save(); // database save
    return result;
});
// const searchMovies = async (payload: any) => {
//   let searchTerm = "";
//   if (payload?.searchTerm) {
//     searchTerm = payload.searchTerm as string;
//   }
//   const searchAbleFields = ["title", "genre"];
//   // {title: {$regex: searchTerm}}
//   // {genre: {$regex: searchTerm}}
//   const searchedMovies = Movie.find({
//     $or: searchAbleFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   });
//   return searchedMovies;
// };
// const sort = async (payload: any, modelQuery) => {
//   let sortBy = "-releaseDate";
//   if (payload?.sortBy) {
//     sortBy = payload.sortBy as string;
//   }
//   const sortQuery = modelQuery.sort(sortBy);
//   return sortQuery;
// };
//new QueryBuilder(Movie.find({}), query)
const getAllMovies = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const movie = await Movie.find({});
    // Searching - Partially Match - In..
    // let searchTerm = "";
    // if (payload?.searchTerm) {
    //   searchTerm = payload.searchTerm as string;
    // }
    // const searchAbleFields = ["title", "genre"];
    // // {title: {$regex: searchTerm}}
    // // {genre: {$regex: searchTerm}}
    // const searchedMovies = Movie.find({
    //   $or: searchAbleFields.map((field) => ({
    //     [field]: { $regex: searchTerm, $options: "i" },
    //   })),
    // });
    // const searchedMovies1 = Movie.find({
    //   $or: [
    //     { title: { $regex: searchTerm, $options: "i" } },
    //     { genre: { $regex: searchTerm, $options: "i" } },
    //   ]
    // });
    // pagination
    // 1st skip =0
    //  2nd skip =2*10 - 1*10
    //  3rd skip =3*10 - 2*10
    //  skip = (page-1)*limit
    // let limit: number = Number(payload?.limit || 10);
    // let skip: number = 0;
    // if (payload?.page) {
    //   const page: number = Number(payload?.page || 1);
    //   skip = Number((page - 1) * limit);
    // }
    // const skipedQuery = searchedMovies.skip(skip);
    // const limitQuery = skipedQuery.limit(limit);
    // {page:1, limit:5, sortBy: "-"}
    // sorting
    // let sortBy = "-releaseDate";
    // if (payload?.sortBy) {
    //   sortBy = payload.sortBy as string;
    // }
    // const sortQuery = limitQuery.sort(sortBy);
    // field filtering
    // {fields: a,b,c}
    // let fields = " ";
    // if (payload.fields) {
    //   fields = (payload?.fields as string).split(",").join(" ");
    // }
    // const fieldQuery = sortQuery.select(fields);
    // // cpoied from payload object
    // //Filtering - Exact Match - title = "Inception"
    // const queryObj = { ...payload };
    // const excludeFields = ["searchTerm", "page", "limit", "sortBy", "fields"];
    // excludeFields.forEach((e) => delete queryObj[e]);
    // const result = await fieldQuery.find(queryObj);
    const movieQuery = new QueryBuilder_1.QueryBuilder(movie_model_1.Movie.find({}), payload)
        .filter()
        .search(movie_constants_1.MovieSearchableFields)
        .fields()
        .paginate()
        .sort();
    const result = yield movieQuery.modelQuery;
    return result;
});
const getMovieBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield movie_model_1.Movie.findOne({ slug: slug });
    return movie;
});
exports.MovieServices = {
    createMovie,
    getAllMovies,
    getMovieBySlug,
};
//interface => schema => model => query

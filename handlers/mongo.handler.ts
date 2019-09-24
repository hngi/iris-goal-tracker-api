import { Document, Model } from "mongoose"

export type PopulateOptions = {
  path: string;
  select?: string;
  populate?: PopulateOptions
};

class MongoHandler {
  constructor() { }


  /**
   * Saves a document and returns the saved document
   * @param doc
   * @returns Document
   */
  save(doc: Document) {
    return doc.save()
  }

  /**
   * Deletes a document and returns the saved document
   * @param doc
   * @returns Document
   */
  delete(doc: Document) {
    return doc.remove()
  }

  /**
   * Deletes a document from a model that matches specified conditions
   * @param model
   * @param conditions
   * @returns Document
   */
  findAndDelete(model: Model<any>, conditions: any): Promise<Document> {
    return new Promise((resolve, reject) => {
      model.find(conditions, (err: any, docs: Document[]) => {
        if (err) reject(err)

        if (docs.length > 0) {
          docs[0].remove((err: any, doc: Document) => {
            if (err) reject(err)
            resolve(doc)
          })
        }
      })
    })
  }

  /**
   * Finds documents in a collection and returns an array of found docs
   * @param model
   * @param conditions
   * @param sort
   * @param limit
   * @returns Document[]
   */
  find(model: Model<any>, conditions?: any, sort?: any, limit?: number, populatePaths?: PopulateOptions[]): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      const query = model.find(conditions || {})
        .sort(sort || {})
        .limit(limit || 50)

      if (populatePaths && Array.isArray(populatePaths)) {
        populatePaths.forEach(p => {
          query.populate(p)
        })
      }

      query.exec((err, results) => {
        if (err) {
          reject(err)
        }

        resolve(results)
      })
    })
  }

  findAndStream(model: Model<any>, conditions?: any) {
    return model.find(conditions || {}).cursor()
  }

  /**
   * Finds documents in a collection and returns an array of found docs
   * @param model
   * @param conditions
   * @param sort
   * @param limit
   * @returns Document[]
   */
  findOne(model: Model<any>, id: string): Promise<Document> {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, result) => {
        if (err) reject(err)

        if (result) {
          resolve(result)
        } else {
          reject(`could not find resource with id: ${id}`)
        }
      })
    })
  }

  findLastest(model: Model<any>, conditions?: any) {
    return new Promise((resolve, reject) => {
      model.find(conditions || {}).limit(1).sort({ $natural: -1 })
        .exec((err, result) => {
          if (err) reject(err)

          resolve(result[0])
        })
    })
  }

  aggregate(model: Model<any>, aggregations: any[]): Promise<Document[]> {
    return new Promise((resolve, reject) => {
      model.aggregate(aggregations, (err: any, docs: any) => {
        if (err) {
          reject(err)
        }

        resolve(docs)
      })
    })
  }

  /**
   * Finds documents in a collection and returns an array of found docs
   * @param model
   * @param conditions
   * @returns number
   */
  count(model: Model<any>, query?: any): Promise<Number> {
    return new Promise((resolve, reject) => {
      model[query ? 'countDocuments' : 'estimatedDocumentCount'](query, (err, count) => {
        if (err) reject(err)
        resolve(count)
      })
    })
  }

  /**
   * Updates a model's fields dynamically
   * @param {!any} params
   * @param {!String[]} skipUpdate
   */
  update(doc: any, params: any, skipUpdate: string[]): Promise<Document> {
    return new Promise((resolve, reject) => {
      if (typeof params !== 'object') {
        reject('params is not an object')
      }

      for (const key in params) {
        if (typeof doc[key] === 'undefined') continue

        if (skipUpdate.indexOf(key) < 0) {
          doc[key] = params[key]
        }
      }

      this.save(doc)
        .then((updatedDoc) => resolve(updatedDoc))
        .catch(e => reject(e))
    })
  }
}

export default new MongoHandler()
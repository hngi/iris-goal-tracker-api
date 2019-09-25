export const GoalsAggregations = [
  {
    '$lookup': {
      'from': 'todos',
      'as': 'meta',
      'pipeline': [
        {
          '$facet': {
            'totalTodos': [
              {
                '$count': 'value'
              }
            ],
            'completedTodos': [
              {
                '$match': {
                  'isComplete': true
                }
              }, {
                '$count': 'value'
              }
            ]
          }
        }
      ]
    }
  }, {
    '$unwind': {
      'path': '$meta',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$unwind': {
      'path': '$meta.totalTodos',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$unwind': {
      'path': '$meta.completedTodos',
      'preserveNullAndEmptyArrays': true
    }
  }
]
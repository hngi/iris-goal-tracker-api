export const GoalsAggregations = [
  {
    '$lookup': {
      'from': 'todos',
      'let': {
        'goalId': '$_id'
      },
      'as': 'meta',
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$goal', '$$goalId'
              ]
            }
          }
        }, {
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
  }, {
    '$addFields': {
      'isComplete': {
        '$cond': [
          '$meta.totalTodos', {
            '$eq': [
              '$meta.completedTodos.value', '$meta.totalTodos.value'
            ]
          }, false
        ]
      }
    }
  }
]

export const SingleGoalAggregations = [
  {
    $lookup: {
      from: 'todos',
      localField: '_id',
      foreignField: 'goal',
      as: 'todos'
    }
  }
]
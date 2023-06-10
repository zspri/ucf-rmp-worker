import { Env } from './env'

export const GRAPHQL_QUERY = `
query TeacherSearchResultsPageQuery(
  $query: TeacherSearchQuery!
) {
  search: newSearch {
    ...TeacherSearchPagination_search_1ZLmLD
  }
}

fragment TeacherSearchPagination_search_1ZLmLD on newSearch {
  teachers(query: $query, first: 1, after: "") {
    didFallback
    edges {
      cursor
      node {
        ...TeacherCard_teacher
        id
      }
    }
    resultCount
  }
}

fragment TeacherCard_teacher on Teacher {
  id
  legacyId
  avgRating
  numRatings
  ...CardFeedback_teacher
  ...CardSchool_teacher
  ...CardName_teacher
  ...TeacherBookmark_teacher
}

fragment CardFeedback_teacher on Teacher {
  wouldTakeAgainPercent
  avgDifficulty
}

fragment CardSchool_teacher on Teacher {
  department
  school {
    name
    id
  }
}

fragment CardName_teacher on Teacher {
  firstName
  lastName
}

fragment TeacherBookmark_teacher on Teacher {
  id
  isSaved
}`

export async function searchProfessors(query: string, env: Env): Promise<[number, unknown]> {
    const req = await fetch(env.RMP_GRAPHQL_ENDPOINT_URL, {
        method: 'POST',
        headers: {
            'Authorization': env.RMP_GRAPHQL_AUTH_HEADER,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: GRAPHQL_QUERY,
            variables: {
                query: {
                    text: query,
                    schoolID: env.RMP_GRAPHQL_SCHOOL_ID
                }
            }
        })
    })
    return [req.status, await req.json()]
}

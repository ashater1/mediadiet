export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _AuthorToBook: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_AuthorToBook_A_fkey"
            columns: ["A"]
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_AuthorToBook_B_fkey"
            columns: ["B"]
            referencedRelation: "book"
            referencedColumns: ["id"]
          }
        ]
      }
      _DirectorToMovie: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_DirectorToMovie_A_fkey"
            columns: ["A"]
            referencedRelation: "director"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_DirectorToMovie_B_fkey"
            columns: ["B"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          }
        ]
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      _StudioToTvShow: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_StudioToTvShow_A_fkey"
            columns: ["A"]
            referencedRelation: "studio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_StudioToTvShow_B_fkey"
            columns: ["B"]
            referencedRelation: "tv_show"
            referencedColumns: ["id"]
          }
        ]
      }
      _UserFollows: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_UserFollows_A_fkey"
            columns: ["A"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_UserFollows_B_fkey"
            columns: ["B"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      author: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      book: {
        Row: {
          cover_id: string | null
          id: string
          isbn_10: string | null
          isbn_13: string | null
          published_date: string | null
          title: string
        }
        Insert: {
          cover_id?: string | null
          id: string
          isbn_10?: string | null
          isbn_13?: string | null
          published_date?: string | null
          title: string
        }
        Update: {
          cover_id?: string | null
          id?: string
          isbn_10?: string | null
          isbn_13?: string | null
          published_date?: string | null
          title?: string
        }
        Relationships: []
      }
      book_for_later: {
        Row: {
          bookId: string
          created_date: string
          id: string
          userId: string
        }
        Insert: {
          bookId: string
          created_date?: string
          id?: string
          userId: string
        }
        Update: {
          bookId?: string
          created_date?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_for_later_bookId_fkey"
            columns: ["bookId"]
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_for_later_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      book_review: {
        Row: {
          audiobook: boolean
          bookId: string
          consumed_date: string
          created_date: string | null
          favorited: boolean | null
          id: string
          review: string | null
          stars: number | null
          user_id: string
        }
        Insert: {
          audiobook?: boolean
          bookId: string
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          review?: string | null
          stars?: number | null
          user_id: string
        }
        Update: {
          audiobook?: boolean
          bookId?: string
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          review?: string | null
          stars?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_review_bookId_fkey"
            columns: ["bookId"]
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_review_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      director: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      movie: {
        Row: {
          id: string
          poster_path: string | null
          released_year: number | null
          title: string
        }
        Insert: {
          id: string
          poster_path?: string | null
          released_year?: number | null
          title: string
        }
        Update: {
          id?: string
          poster_path?: string | null
          released_year?: number | null
          title?: string
        }
        Relationships: []
      }
      movie_for_later: {
        Row: {
          created_date: string
          id: string
          movieId: string
          userId: string
        }
        Insert: {
          created_date?: string
          id?: string
          movieId: string
          userId: string
        }
        Update: {
          created_date?: string
          id?: string
          movieId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_for_later_movieId_fkey"
            columns: ["movieId"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_for_later_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      movie_review: {
        Row: {
          consumed_date: string
          created_date: string | null
          favorited: boolean | null
          id: string
          in_theater: boolean | null
          movieId: string
          on_plane: boolean | null
          review: string | null
          stars: number | null
          userId: string
        }
        Insert: {
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          in_theater?: boolean | null
          movieId: string
          on_plane?: boolean | null
          review?: string | null
          stars?: number | null
          userId: string
        }
        Update: {
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          in_theater?: boolean | null
          movieId?: string
          on_plane?: boolean | null
          review?: string | null
          stars?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_review_movieId_fkey"
            columns: ["movieId"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_review_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      show_for_later: {
        Row: {
          created_date: string
          id: string
          tvShowId: string
          userId: string
        }
        Insert: {
          created_date?: string
          id?: string
          tvShowId: string
          userId: string
        }
        Update: {
          created_date?: string
          id?: string
          tvShowId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_for_later_tvShowId_fkey"
            columns: ["tvShowId"]
            referencedRelation: "tv_show"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_for_later_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      studio: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      tv_review: {
        Row: {
          consumed_date: string
          created_date: string | null
          favorited: boolean | null
          id: string
          review: string | null
          stars: number | null
          tvSeasonId: string
          userId: string
        }
        Insert: {
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          review?: string | null
          stars?: number | null
          tvSeasonId: string
          userId: string
        }
        Update: {
          consumed_date?: string
          created_date?: string | null
          favorited?: boolean | null
          id?: string
          review?: string | null
          stars?: number | null
          tvSeasonId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "tv_review_tvSeasonId_fkey"
            columns: ["tvSeasonId"]
            referencedRelation: "tv_season"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tv_review_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      tv_season: {
        Row: {
          airDate: string | null
          id: string
          poster_path: string | null
          season_number: number | null
          title: string | null
          tvShowId: string
        }
        Insert: {
          airDate?: string | null
          id: string
          poster_path?: string | null
          season_number?: number | null
          title?: string | null
          tvShowId: string
        }
        Update: {
          airDate?: string | null
          id?: string
          poster_path?: string | null
          season_number?: number | null
          title?: string | null
          tvShowId?: string
        }
        Relationships: [
          {
            foreignKeyName: "tv_season_tvShowId_fkey"
            columns: ["tvShowId"]
            referencedRelation: "tv_show"
            referencedColumns: ["id"]
          }
        ]
      }
      tv_show: {
        Row: {
          id: string
          title: string | null
        }
        Insert: {
          id: string
          title?: string | null
        }
        Update: {
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          avatar: string | null
          bio: string | null
          created_date: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          username: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_date?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          username: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_date?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface User {
  id?: number,
  email?: string,
  first_name?: string,
  last_name?: string,
  student_id?: string,
  experience?: string,
  about?: string,
  subscribe_email?: boolean,
  avatar_url?: string,
  last_login?: Date,
  date_joined?: Date,
  is_staff?: boolean,
  is_superuser?: boolean,
}

export interface Activity {
  id: number,
  title: string,
  datetime: Date,
  location: string,
  presenter: User[],
  attender: User[],
  check_in_open: boolean,
  check_in_code?: string
}
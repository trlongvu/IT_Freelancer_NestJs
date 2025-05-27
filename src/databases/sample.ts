export const ADMIN_ROLE = 'SUPER_ADMIN';
export const USER_ROLE = 'NORMAL_USER';

export const INIT_PERMISSIONS = [
  {
    name: 'Get Company with paginate',
    apiPath: '/api/v1/companies',
    method: 'GET',
    module: 'COMPANIES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
    isDeleted: false,
    deletedAt: null,
  },
  {
    name: 'Create Company',
    apiPath: '/api/v1/companies',
    method: 'POST',
    module: 'COMPANIES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update Company',
    apiPath: '/api/v1/companies/:id',
    method: 'PATCH',
    module: 'COMPANIES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete Company',
    apiPath: '/api/v1/companies/:id',
    method: 'DELETE',
    module: 'COMPANIES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get Company by id',
    apiPath: '/api/v1/companies/:id',
    method: 'GET',
    module: 'COMPANIES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Create User',
    apiPath: '/api/v1/users',
    method: 'POST',
    module: 'USERS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get User by Id',
    apiPath: '/api/v1/users/:id',
    method: 'GET',
    module: 'USERS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get User with paginate',
    apiPath: '/api/v1/users',
    method: 'GET',
    module: 'USERS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update User',
    apiPath: '/api/v1/users/:id',
    method: 'PATCH',
    module: 'USERS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete User',
    apiPath: '/api/v1/users/:id',
    method: 'DELETE',
    module: 'USERS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Upload Single File',
    apiPath: '/api/v1/files/upload',
    method: 'POST',
    module: 'FILES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Create a Job',
    apiPath: '/api/v1/jobs',
    method: 'POST',
    module: 'JOBS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get a job by id',
    apiPath: '/api/v1/jobs/:id',
    method: 'GET',
    module: 'JOBS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update a Job',
    apiPath: '/api/v1/jobs/:id',
    method: 'PATCH',
    module: 'JOBS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get Job with paginate',
    apiPath: '/api/v1/jobs',
    method: 'GET',
    module: 'JOBS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete a Job',
    apiPath: '/api/v1/jobs/:id',
    method: 'DELETE',
    module: 'JOBS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Create a Resume',
    apiPath: '/api/v1/resumes',
    method: 'POST',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch resume with paginate',
    apiPath: '/api/v1/resumes',
    method: 'GET',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Get resume by id',
    apiPath: '/api/v1/resumes/:id',
    method: 'GET',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete a resume',
    apiPath: '/api/v1/resumes/:id',
    method: 'DELETE',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update resume status',
    apiPath: '/api/v1/resumes/:id',
    method: 'PATCH',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch resumes by user',
    apiPath: '/api/v1/resumes/by-user',
    method: 'GET',
    module: 'RESUMES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Create a permission',
    apiPath: '/api/v1/permissions',
    method: 'POST',
    module: 'PERMISSIONS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch Permission with paginate',
    apiPath: '/api/v1/permissions',
    method: 'GET',
    module: 'PERMISSIONS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch permission by id',
    apiPath: '/api/v1/permissions/:id',
    method: 'GET',
    module: 'PERMISSIONS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update a permission',
    apiPath: '/api/v1/permissions/:id',
    method: 'PATCH',
    module: 'PERMISSIONS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete a permission',
    apiPath: '/api/v1/permissions/:id',
    method: 'DELETE',
    module: 'PERMISSIONS',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Create Role',
    apiPath: '/api/v1/roles',
    method: 'POST',
    module: 'ROLES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch roles with paginate',
    apiPath: '/api/v1/roles',
    method: 'GET',
    module: 'ROLES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Fetch role by id',
    apiPath: '/api/v1/roles/:id',
    method: 'GET',
    module: 'ROLES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Update Role',
    apiPath: '/api/v1/roles/:id',
    method: 'PATCH',
    module: 'ROLES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
  {
    name: 'Delete a Role',
    apiPath: '/api/v1/roles/:id',
    method: 'DELETE',
    module: 'ROLES',
    createdBy: {
      _id: '683580998dc8f409e0370cb9',
      email: 'vu65617@gmail.com',
    },
  },
];

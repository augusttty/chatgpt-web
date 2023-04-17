import { isNotEmptyString } from '../utils/is'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY
  const isAuthNotEmpty = isNotEmptyString(AUTH_SECRET_KEY)
  if (isAuthNotEmpty) {
    try {
      const Authorization = req.header('Authorization')
      const bear = Authorization.replace('Bearer ', '').trim()
      const isInvalidAuth = bear !== AUTH_SECRET_KEY.trim()
      const isInvalidAdmin = bear !== ADMIN_SECRET_KEY.trim()
      if (!Authorization)
        throw new Error('Error: 无访问权限 | No access rights')

      if (isInvalidAuth && isInvalidAdmin)
        throw new Error('Error: 无访问权限 | No access rights')

      // if (!Authorization || ( (bear  !== AUTH_SECRET_KEY.trim() ) && ( bear !== ADMIN_SECRET_KEY.trim())))
      //   throw new Error('Error: 无访问权限 | No access rights')
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }

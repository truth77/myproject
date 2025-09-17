const { ForbiddenError } = require('../helpers/errors');

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

const roleHierarchy = {
  [ROLES.USER]: 1,
  [ROLES.ADMIN]: 2,
  [ROLES.SUPERADMIN]: 3
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const userRole = req.user.role || ROLES.USER;
      
      if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const roles = {
  requireUser: checkRole(ROLES.USER),
  requireAdmin: checkRole(ROLES.ADMIN),
  requireSuperAdmin: checkRole(ROLES.SUPERADMIN),
  ROLES
};

module.exports = roles;

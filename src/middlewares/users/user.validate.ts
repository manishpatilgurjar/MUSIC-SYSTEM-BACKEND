import { Request, Response, NextFunction } from 'express';
import Role, { IRole } from '../../models/roles'; // Import Role model and IRole interface
import { ResponseCodes } from '../../utils/responseCodes';
import { ResponseMessages } from '../../utils/responseMessages';
import { verifyAccessToken } from '../../helpers/user.helper';
import { handleResponse } from '../../helpers/responseFormate';
import Permission,{ IPermission } from '../../models/permission'// Import Permission model and IPermission interface
 
declare global {
    namespace Express {
        interface Request {
            userRole?: IRole; // Optional, as per your usage
            userPermissions?: string[]; // Assuming permission.name is of type string
        }
    }
}
class ValidateUserRole {
    public async checkUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract the access token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json(handleResponse(ResponseCodes.unauthorized, "Unauthorized"));
            }

            // Remove 'Bearer ' prefix from the token
            const accessToken = authHeader.substring(7);

            // Verify access token and get user details
            let user;
            if (accessToken) {
                user = await verifyAccessToken(accessToken);
            }

            if (!user) {
                return res.status(401).json(handleResponse(ResponseCodes.unauthorized, "Unauthorized"));
            }

            // Fetch role details from database
            const role: IRole | null = await Role.findById(user.role);

            if (!role) {
                return res.status(404).json(handleResponse(ResponseCodes.notFound, "Role not found"));
            }

            // Fetch permissions associated with the role
            const rolePermissions: any = role.permissions;

            // Query permissions collection to get details of rolePermissions
            const userPermissions: IPermission[] = await Permission.find({
                _id: { $in: rolePermissions }
            });

            if (!userPermissions || userPermissions.length === 0) {
                return res.status(403).json(handleResponse(ResponseCodes.notFound, "Role has no permissions assigned"));
            }
            req.userRole = role;
            req.userPermissions = userPermissions.map(permission => permission.name); // Assuming permission.name is the name of the permission

            next();
        } catch (error) {
            return res.status(500).json(handleResponse(500, "Invalid Token or Missing Token"));
        }
    }
}

export default new ValidateUserRole();

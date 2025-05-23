import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    X,
    Search,
    User,
    UserCheck,
    Heart,
    Users,
    MessageCircle,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import {
    fetchAvailableUsers,
    createNewChat,
    clearError
} from '../../store/chatSlice';
import socketService from '../../services/socket';

const NewChatModal = ({ onClose, currentUser }) => {
    const dispatch = useDispatch();
    const { availableUsers, isLoadingUsers, error } = useSelector(state => state.chat);

    const [selectedRole, setSelectedRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [creationStatus, setCreationStatus] = useState(null); // 'success' | 'error'

    // Available roles for admin to chat with
    const availableRoles = [
        { value: 'all', label: 'All Users', icon: Users },
        { value: 'doctor', label: 'Doctors', icon: User },
        { value: 'nurse', label: 'Nurses', icon: Heart },
        { value: 'family_member', label: 'Family Members', icon: User }
    ];

    // If current user is not admin, adjust available roles
    const filteredRoles = currentUser.role === 'admin'
        ? availableRoles
        : availableRoles.filter(role => {
            if (currentUser.role === 'doctor') {
                return ['all', 'admin', 'nurse', 'family_member'].includes(role.value);
            } else if (currentUser.role === 'nurse') {
                return ['all', 'admin', 'doctor', 'family_member'].includes(role.value);
            } else if (currentUser.role === 'family_member') {
                return ['all', 'admin', 'doctor', 'nurse'].includes(role.value);
            }
            return true;
        });

    useEffect(() => {
        dispatch(fetchAvailableUsers(selectedRole));
    }, [dispatch, selectedRole]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const filteredUsers = availableUsers.filter(user => {
        if (!user || typeof user.name !== 'string') return false;
        return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });


    const getRoleInfo = (role) => {
        const roleConfig = {
            admin: {
                color: 'text-red-600',
                bgColor: 'bg-red-50 border-red-200',
                label: 'Admin',
                icon: UserCheck
            },
            doctor: {
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 border-blue-200',
                label: 'Doctor',
                icon: User
            },
            nurse: {
                color: 'text-green-600',
                bgColor: 'bg-green-50 border-green-200',
                label: 'Nurse',
                icon: Heart
            },
            family_member: {
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 border-purple-200',
                label: 'Family Member',
                icon: User
            }
        };
        return roleConfig[role] || {
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 border-gray-200',
            label: role,
            icon: User
        };
    };

    const determineChatType = (userRole, targetRole) => {
        const roles = [userRole, targetRole].sort();

        if (roles.includes('admin') && (roles.includes('doctor') || roles.includes('nurse'))) {
            return 'admin-staff';
        } else if (roles.includes('admin') && roles.includes('family_member')) {
            return 'admin-family';
        } else if ((roles.includes('doctor') || roles.includes('nurse')) && roles.includes('family_member')) {
            return 'staff-family';
        } else if (roles.includes('doctor') && roles.includes('nurse')) {
            return 'doctor-nurse';
        }

        return 'general';
    };

    const handleCreateChat = async () => {
        if (!selectedUser) return;

        setIsCreating(true);
        setCreationStatus(null);
 
        try {
            const chatType = determineChatType(currentUser.role, selectedUser.role);

            // Create via Socket.IO for real-time
            socketService.initializeChat(
                currentUser._id,
                selectedUser._id,
                chatType,
                `Chat with ${selectedUser.name}`
            );

            // Also create via Redux/API
            await dispatch(createNewChat({
                targetUserId: selectedUser._id,
                chatType,
                title: `Chat with ${selectedUser.name}`
            })).unwrap();

            setCreationStatus('success');

            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error creating chat:', error);
            setCreationStatus('error');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">New Chat</h2>
                            <p className="text-sm text-gray-500">Start a conversation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
                        {filteredRoles.map(role => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.value}
                                    onClick={() => setSelectedRole(role.value)}
                                    className={`
                    flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${selectedRole === role.value
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{role.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoadingUsers ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="font-medium">No users found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map(user => {
                                const roleInfo = getRoleInfo(user.role);
                                const RoleIcon = roleInfo.icon;
                                const isSelected = selectedUser?._id === user._id;

                                return (
                                    <button
                                        key={user._id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`
                      w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all border
                      ${isSelected
                                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                                            }
                    `}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                        ${user.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                                    user.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                                                        user.role === 'nurse' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                                            'bg-gradient-to-br from-purple-500 to-purple-600'}
                      `}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={`
                        absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                        ${roleInfo.bgColor}
                      `}>
                                                <RoleIcon className="w-2.5 h-2.5" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                            <p className={`text-sm font-medium ${roleInfo.color}`}>
                                                {roleInfo.label}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    {error && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mb-3 p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {creationStatus === 'success' && (
                        <div className="flex items-center space-x-2 text-green-600 text-sm mb-3 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Chat created successfully!</span>
                        </div>
                    )}

                    {creationStatus === 'error' && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mb-3 p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Failed to create chat. Please try again.</span>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateChat}
                            disabled={!selectedUser || isCreating}
                            className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                ${selectedUser && !isCreating
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
              `}
                        >
                            {isCreating ? 'Creating...' : 'Start Chat'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
export const PERMISSIONS = {

  SITE_ACCESS:
    "site.access",

  MODULE_BK:
    "module.bk",

  MODULE_KNOWLEDGE:
    "module.knowledge",

  MODULE_MODELS3D:
    "module.models3d",

  BK_GALLERY_VIEW:
    "bk.gallery.view",

  BK_ITEM_VIEW:
    "bk.item.view",

  KNOWLEDGE_MEDIA_SEE:
    "knowledge.media.see",

  KNOWLEDGE_MEDIA_VIEW:
    "knowledge.media.view",

  KNOWLEDGE_PHOTOS_VIEW:
    "knowledge.photos.view",

  KNOWLEDGE_FILES_VIEW:
    "knowledge.files.view",

  KNOWLEDGE_VIDEOS_VIEW:
    "knowledge.videos.view",

  MODELS3D_ITEM_VIEW:
    "models3d.item.view",

  MODELS3D_MEDIA_VIEW:
    "models3d.media.view",

  MODELS3D_MEDIA_SEE:
    "models3d.media.see",

  MODELS3D_DOWNLOAD:
    "models3d.download"

};


export const ROLES = {

  admin: {

    permissions: [
      "*"
    ],

    knowledge: {

      categories: "*"

    }

  },


  duty: {

    permissions: [
      "*"
    ],

    knowledge: {

      categories: "*"

    }

  },


  pilot: {

    permissions: [

      PERMISSIONS.SITE_ACCESS,

      PERMISSIONS.MODULE_BK,

      PERMISSIONS.BK_GALLERY_VIEW,

      PERMISSIONS.BK_ITEM_VIEW,

      PERMISSIONS.MODULE_KNOWLEDGE,

      PERMISSIONS.KNOWLEDGE_MEDIA_SEE,

      PERMISSIONS.KNOWLEDGE_MEDIA_VIEW,

      PERMISSIONS.KNOWLEDGE_PHOTOS_VIEW,

      PERMISSIONS.KNOWLEDGE_FILES_VIEW,

      PERMISSIONS.KNOWLEDGE_VIDEOS_VIEW,

      PERMISSIONS.MODULE_MODELS3D,

      PERMISSIONS.MODELS3D_ITEM_VIEW,

      PERMISSIONS.MODELS3D_MEDIA_SEE,

      PERMISSIONS.MODELS3D_MEDIA_VIEW,

      PERMISSIONS.MODELS3D_DOWNLOAD

    ],

    knowledge: {

      categories: [
        "fpv",
        "bomberh",
        "bomberl",
        "mavic",
        "wingrecon",
        "wingfpv",
        "wingstrike",
        "ppo",
        "ew",
        "tacmed",
        "conceal",
        "general",
        "a2"
      ]

    }

  },


  guest: {

    permissions: [

      PERMISSIONS.SITE_ACCESS,

      PERMISSIONS.MODULE_BK,

      PERMISSIONS.BK_GALLERY_VIEW,

      PERMISSIONS.BK_ITEM_VIEW,

      PERMISSIONS.MODULE_KNOWLEDGE,

      PERMISSIONS.KNOWLEDGE_MEDIA_SEE,

      PERMISSIONS.MODULE_MODELS3D,

      PERMISSIONS.MODELS3D_ITEM_VIEW,

      PERMISSIONS.MODELS3D_MEDIA_SEE

    ],

    knowledge: {

      categories: "*"

    }

  },

  testUser: {

    permissions: [

      PERMISSIONS.SITE_ACCESS,

      PERMISSIONS.MODULE_BK,

      PERMISSIONS.MODULE_KNOWLEDGE,

      PERMISSIONS.KNOWLEDGE_MEDIA_SEE,

      PERMISSIONS.KNOWLEDGE_MEDIA_VIEW,

      PERMISSIONS.KNOWLEDGE_FILES_VIEW,

      PERMISSIONS.MODULE_MODELS3D,

      PERMISSIONS.MODELS3D_ITEM_VIEW,

      PERMISSIONS.MODELS3D_MEDIA_SEE,

      PERMISSIONS.MODELS3D_MEDIA_VIEW

    ],

    knowledge: {

      categories: ["tacmed","fa"]

    }

  }

};




export function getRoleConfig(role) {

  if (
    !role ||
    typeof role !== "string"
  ) {

    return null;

  }

  return ROLES[role] || null;

}


export function isValidRole(role) {

  return Boolean(
    getRoleConfig(role)
  );

}


export function getRolePermissions(role) {

  const roleConfig =
    getRoleConfig(role);

  if (!roleConfig) {

    return [];

  }

  return [
    ...(roleConfig.permissions || [])
  ];

}


export function getEffectivePermissions(user) {

  if (
    !user ||
    typeof user !== "object"
  ) {

    return [];

  }

  const rolePermissions =
    getRolePermissions(user.role);

  const userPermissions =
    Array.isArray(user.permissions)
      ? user.permissions
      : [];

  const denyPermissions =
    Array.isArray(user.denyPermissions)
      ? user.denyPermissions
      : [];

  if (
    rolePermissions.includes("*")
  ) {

    if (
      denyPermissions.length === 0
    ) {

      return ["*"];

    }

    const allPermissions =
      Object.values(PERMISSIONS);

    return allPermissions.filter(
      permission =>
        !denyPermissions.includes(permission)
    );

  }

  const permissions =
    new Set([
      ...rolePermissions,
      ...userPermissions
    ]);

  denyPermissions.forEach(
    permission => {

      permissions.delete(permission);

    }
  );

  return [...permissions];

}


export function hasPermission(
  user,
  permission
) {

  if (
    !user ||
    user.active !== true
  ) {

    return false;

  }

  if (
    !isValidRole(user.role)
  ) {

    return false;

  }

  const permissions =
    getEffectivePermissions(user);

  return (
    permissions.includes("*") ||
    permissions.includes(permission)
  );

}


export function getKnowledgeCategories(user) {

  if (
    !user ||
    user.active !== true
  ) {

    return [];

  }

  const roleConfig =
    getRoleConfig(user.role);

  if (!roleConfig) {

    return [];

  }

  const userKnowledge =
    user.knowledge &&
    typeof user.knowledge === "object"
      ? user.knowledge
      : {};

  if (
    userKnowledge.categories === "*"
  ) {

    return "*";

  }

  if (
    Array.isArray(
      userKnowledge.categories
    )
  ) {

    return [
      ...userKnowledge.categories
    ];

  }

  const roleCategories =
    roleConfig.knowledge?.categories;

  if (
    roleCategories === "*"
  ) {

    return "*";

  }

  if (
    Array.isArray(roleCategories)
  ) {

    return [
      ...roleCategories
    ];

  }

  return [];

}


export function canAccessKnowledgeCategory(
  user,
  category
) {

  if (
    !hasPermission(
      user,
      PERMISSIONS.MODULE_KNOWLEDGE
    )
  ) {

    return false;

  }

  if (
    !category ||
    typeof category !== "string"
  ) {

    return false;

  }

  const categories =
    getKnowledgeCategories(user);

  if (categories === "*") {

    return true;

  }

  return categories.includes(category);

}


export function normalizeUserRecord(
  value
) {

  if (!value) {

    return null;

  }

  let user;

  try {

    user =
      typeof value === "string"
        ? JSON.parse(value)
        : value;

  }
  catch {

    return null;

  }

  if (
    !user ||
    typeof user !== "object"
  ) {

    return null;

  }

  if (
    !isValidRole(user.role)
  ) {

    return null;

  }

  return {

    role:
      user.role,

    active:
      user.active === true,

    permissions:
      Array.isArray(user.permissions)
        ? user.permissions
        : [],

    denyPermissions:
      Array.isArray(user.denyPermissions)
        ? user.denyPermissions
        : [],

    knowledge:
      user.knowledge &&
      typeof user.knowledge === "object"
        ? user.knowledge
        : {}

  };

}
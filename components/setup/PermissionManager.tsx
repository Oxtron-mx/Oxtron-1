"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Module,
  Permission,
  getModules,
  getUserPermissions,
  updateUserPermissions,
} from "@/actions/permission";

interface PermissionManagerProps {
  userId: number;
  onSave?: () => void;
}

/**
 * Component to manage user permissions by module.
 * 
 * Displays a tree structure of modules with checkboxes for read/write permissions.
 */
export default function PermissionManager({ userId, onSave }: PermissionManagerProps) {
  const { data: session } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Record<number, Permission>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      const [modulesData, permissionsData] = await Promise.all([
        getModules(session.accessToken as string),
        getUserPermissions(session.accessToken as string, userId),
      ]);

      setModules(modulesData);
      
      // Convert permissions array to map by module_id
      const permMap: Record<number, Permission> = {};
      permissionsData.forEach((perm) => {
        permMap[perm.module_id] = perm;
      });
      setPermissions(permMap);
    } catch (error) {
      console.error("Error loading permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (moduleId: number, type: "read" | "write", value: boolean) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      if (!updated[moduleId]) {
        updated[moduleId] = {
          id: 0,
          module_id: moduleId,
          module_code: "",
          module_name: "",
          can_read: false,
          can_write: false,
        };
      }
      updated[moduleId] = {
        ...updated[moduleId],
        [type === "read" ? "can_read" : "can_write"]: value,
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;

    try {
      setSaving(true);
      const permissionsToUpdate = Object.values(permissions).map((perm) => ({
        module_id: perm.module_id,
        can_read: perm.can_read,
        can_write: perm.can_write,
      }));

      await updateUserPermissions(
        session.accessToken as string,
        userId,
        permissionsToUpdate
      );

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Error saving permissions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  // Group modules by parent
  const parentModules = modules.filter((m) => !m.parent_module_id);
  const childModules = modules.filter((m) => m.parent_module_id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Permissions</h3>
      
      {parentModules.map((parent) => {
        const children = childModules.filter((c) => c.parent_module_id === parent.id);
        const parentPerm = permissions[parent.id] || {
          can_read: false,
          can_write: false,
        };

        return (
          <div key={parent.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{parent.name}</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={parentPerm.can_read}
                    onChange={(e) =>
                      handlePermissionChange(parent.id, "read", e.target.checked)
                    }
                  />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={parentPerm.can_write}
                    onChange={(e) =>
                      handlePermissionChange(parent.id, "write", e.target.checked)
                    }
                  />
                  <span>Write</span>
                </label>
              </div>
            </div>

            {children.length > 0 && (
              <div className="ml-4 space-y-2 mt-2">
                {children.map((child) => {
                  const childPerm = permissions[child.id] || {
                    can_read: false,
                    can_write: false,
                  };

                  return (
                    <div
                      key={child.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{child.name}</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={childPerm.can_read}
                            onChange={(e) =>
                              handlePermissionChange(child.id, "read", e.target.checked)
                            }
                          />
                          <span>Read</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={childPerm.can_write}
                            onChange={(e) =>
                              handlePermissionChange(child.id, "write", e.target.checked)
                            }
                          />
                          <span>Write</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Permissions"}
      </button>
    </div>
  );
}


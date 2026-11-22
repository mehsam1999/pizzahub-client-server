
"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Search,
  Users,
  ShieldCheck,
  Store,
  User,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import type { Role } from "@/lib/auth"

import {
  getUsers,
  blockUser,
  unblockUser,
} from "@/lib/queries/users"

import { toast } from "@/components/ui/toast"

type AdminUser = {
  id: string
  name: string
  email: string
  role: Role
  banned?: boolean
  banReason?: string | null
  createdAt: string | Date
}

const PAGE_SIZE = 10

const AdminUsersPage = () => {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  const [searchValue, setSearchValue] = useState("")
  const [searchField, setSearchField] = useState<"name" | "email">("name")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    return await getUsers({
      searchValue,
      searchField,
      role: roleFilter,
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
    })
  }, [searchValue, searchField, roleFilter, currentPage])

  // Automatically fetch users when filters or page changes
  useEffect(() => {
    if (sessionLoading || session?.user?.role !== "admin") {
      return
    }

    let ignore = false

    const fetchData = async () => {
      try {
        const result = await fetchUsers()

        if (ignore) return

        if (!result.success || !result.data) {
          setError(result.message || "Unable to load users.")
          setUsers([])
          setTotalUsers(0)
          return
        }

        setError("")
        setUsers(result.data.users as AdminUser[])
        setTotalUsers(result.data.total)
      } catch (err) {
        if (ignore) return

        console.error("Load users error:", err)

        setError("Something went wrong while loading users.")
        setUsers([])
        setTotalUsers(0)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void fetchData()

    return () => {
      ignore = true
    }
  }, [sessionLoading, session?.user?.role, fetchUsers])

  // Manual Refresh
  const loadUsers = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await fetchUsers()

      if (!result.success || !result.data) {
        setError(result.message || "Unable to load users.")
        setUsers([])
        setTotalUsers(0)
        return
      }

      setUsers(result.data.users as AdminUser[])
      setTotalUsers(result.data.total)
      setError("")
    } catch (err) {
      console.error("Load users error:", err)
      setError("Something went wrong while loading users.")
    } finally {
      setIsLoading(false)
    }
  }

  // Search
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
    setIsLoading(true)
  }

  // Role Filter
  const handleRoleChange = (value: Role | "all") => {
    setRoleFilter(value)
    setCurrentPage(1)
    setIsLoading(true)
  }

  // Search Field
  const handleSearchFieldChange = (value: "name" | "email") => {
    setSearchField(value)
    setCurrentPage(1)
    setIsLoading(true)
  }

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setIsLoading(true)
  }

  // Block / Unblock User
  const handleBlockToggle = async (user: AdminUser) => {
    if (user.id === session?.user?.id) {
      toast.add({
        title: "Action not allowed",
        description: "You cannot block your own admin account.",
      })
      return
    }

    setActionLoading(user.id)
    setError("")

    try {
      const result = user.banned
        ? await unblockUser(user.id)
        : await blockUser(user.id)

      if (!result.success) {
        toast.add({
          title: "Action failed",
          description: result.message,
        })
        return
      }

      toast.add({
        title: user.banned ? "User unblocked" : "User blocked",
        description: user.banned
          ? `${user.name} can now access their account.`
          : `${user.name} has been successfully blocked.`,
      })

      await loadUsers()
    } catch (err) {
      console.error("User status update error:", err)

      toast.add({
        title: "Something went wrong",
        description: "Unable to update user status. Please try again.",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Role Icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="size-3.5" />

      case "vendor":
        return <Store className="size-3.5" />

      default:
        return <User className="size-3.5" />
    }
  }

  // Session Loading
  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#8a7565]">
        Loading...
      </div>
    )
  }

  // Admin Authorization
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
        <ShieldCheck className="size-12 text-[#a2743a]" />

        <h1 className="text-xl font-bold text-[#3d2010]">
          Access Denied
        </h1>

        <p className="text-sm text-[#8a7565]">
          Only administrators can manage users.
        </p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#fdf8f1] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#3d2010] text-[#f6c445]">
                <Users className="size-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#3d2010]">
                  Manage Users
                </h1>

                <p className="mt-1 text-sm text-[#8a7565]">
                  Manage and monitor all PizzaHub accounts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e2d2bf] bg-white px-4 text-sm font-semibold text-[#3d2010] transition hover:bg-[#fdf3e6] disabled:opacity-60"
          >
            <RefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total Users */}
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-5">
            <p className="text-sm text-[#8a7565]">
              Total Users
            </p>

            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#3d2010]">
                {totalUsers}
              </h2>

              <Users className="size-7 text-[#c99a3f]" />
            </div>
          </div>

          {/* Active Users */}
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-5">
            <p className="text-sm text-[#8a7565]">
              Active Users
            </p>

            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#24845a]">
                {users.filter((user) => !user.banned).length}
              </h2>

              <CheckCircle className="size-7 text-[#24845a]" />
            </div>

            <p className="mt-1 text-xs text-[#a8907c]">
              On this page
            </p>
          </div>

          {/* Blocked Users */}
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-5">
            <p className="text-sm text-[#8a7565]">
              Blocked Users
            </p>

            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-red-600">
                {users.filter((user) => user.banned).length}
              </h2>

              <Ban className="size-7 text-red-500" />
            </div>

            <p className="mt-1 text-xs text-[#a8907c]">
              On this page
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-[#eadfd2] bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_150px_170px]">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#a8907c]" />

              <input
                type="text"
                value={searchValue}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder={`Search by ${searchField}...`}
                className="h-11 w-full rounded-xl border border-[#e2d2bf] bg-[#fdfaf6] pr-3 pl-10 text-sm text-[#3d2010] outline-none transition focus:border-[#c99a3f] focus:ring-2 focus:ring-[#f6c445]/30"
              />
            </div>

            {/* Search Field */}
            <select
              value={searchField}
              onChange={(event) =>
                handleSearchFieldChange(
                  event.target.value as "name" | "email"
                )
              }
              className="h-11 rounded-xl border border-[#e2d2bf] bg-[#fdfaf6] px-3 text-sm text-[#3d2010] outline-none focus:border-[#c99a3f]"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(event) =>
                handleRoleChange(event.target.value as Role | "all")
              }
              className="h-11 rounded-xl border border-[#e2d2bf] bg-[#fdfaf6] px-3 text-sm text-[#3d2010] outline-none focus:border-[#c99a3f]"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-[#eadfd2] bg-white">

          <div className="flex items-center justify-between border-b border-[#eadfd2] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#3d2010]">
                All Users
              </h2>

              <p className="mt-1 text-xs text-[#8a7565]">
                Showing {users.length} of {totalUsers} users
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-[#fdf8f1] text-xs uppercase tracking-wide text-[#8a7565]">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    User
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Role
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Joined
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0e7dc]">

                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-[#8a7565]"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-[#8a7565]"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-[#fdfaf6]"
                    >

                      {/* User Details */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5ecdf] font-semibold text-[#8b5e2e]">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="font-semibold text-[#3d2010]">
                              {user.name}
                            </p>

                            <p className="mt-1 text-xs text-[#8a7565]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700"
                              : user.role === "vendor"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-[#f5ecdf] text-[#8b5e2e]"
                          }`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="px-5 py-4 text-sm text-[#6b5a4e]">
                        {new Date(user.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {user.banned ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <Ban className="size-3.5" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <CheckCircle className="size-3.5" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleBlockToggle(user)}
                          disabled={
                            actionLoading === user.id ||
                            user.id === session.user.id
                          }
                          title={
                            user.id === session.user.id
                              ? "You cannot block yourself"
                              : user.banned
                                ? "Unblock user"
                                : "Block user"
                          }
                          className={`inline-flex min-w-[105px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.banned
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {actionLoading === user.id ? (
                            "Please wait..."
                          ) : user.banned ? (
                            <>
                              <CheckCircle className="size-3.5" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="size-3.5" />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#eadfd2] px-5 py-4 sm:flex-row">

            <p className="text-xs text-[#8a7565]">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                type="button"
                onClick={() =>
                  handlePageChange(Math.max(1, currentPage - 1))
                }
                disabled={currentPage === 1 || isLoading}
                className="flex size-9 items-center justify-center rounded-lg border border-[#e2d2bf] text-[#3d2010] transition hover:bg-[#fdf3e6] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage >= totalPages || isLoading}
                className="flex size-9 items-center justify-center rounded-lg border border-[#e2d2bf] text-[#3d2010] transition hover:bg-[#fdf3e6] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminUsersPage

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory, useParams, Prompt } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { HiOutlineInformationCircle } from "react-icons/hi";
import useQueryParams from "hooks/common/useQueryParams";
import DrawerComponent from "components/DrawerComponent";
import ComboBox from "components/common/controls/ComboBox";
import MultiComboBox from "components/common/controls/MultiComboBox";
import Input from "components/common/controls/Input";
import Select from "components/common/controls/Select";
import PhoneNumberInput from "components/common/controls/PhoneNumber";
import ProfilePictureSelector from "components/userManagement/ProfilePictureSelector";
import { allRoles, roleTypes, controlTypes } from "utils/constants";
import { useBusinessAccounts } from "hooks/useUser";
import {
  useFarmsByBusinessAccountRef,
  useFarmById,
  useCurrentFarmRefOfUser,
  useGetFarmsByBusinessAccounts,
  useGetCurrentFarmsOfContractor,
} from "hooks/useFarmManagement";
import {
  useUserById,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useDeleteBusinessAccountPermanantly,
  useGetAllUsersByRole,
} from "hooks/useUser";
import { removeEmptyFields } from "utils/helper";
import { routeContextType } from "utils/constants";
import ButtonSpinner from "components/common/Loader/ButtonSpinner";

const schema = (context, existingContractor) =>
  yup
    .object({
      role: yup.string().required("Role is required"),
      businessAccountName: yup.string().when("role", (role, schema) => {
        return role[0] === roleTypes.businessAccount
          ? schema.required("Business account name is required")
          : schema.notRequired();
      }),
      businessAccountRef: yup.string().when("role", (role, schema) => {
        return [roleTypes.user, roleTypes.farmManager].includes(role[0])
          ? schema.required("Business account is required")
          : schema.notRequired();
      }),
      farmId: yup.string().when("role", (role, schema) => {
        return [roleTypes.user, roleTypes.farmManager].includes(role[0])
          ? schema.required("Farm is required")
          : schema.notRequired();
      }),
      contractorBusinessAccountRefs: yup
        .array()
        .when("role", (role, schema) => {
          return [roleTypes.contractor].includes(role[0])
            ? schema.min(1, "Atleast one Business account is required")
            : schema.notRequired();
        }),
      contractorFarmId: yup.array().when("role", (role, schema) => {
        return [roleTypes.contractor].includes(role[0])
          ? schema.min(1, "Atleast one Farm is required")
          : schema.notRequired();
      }),
      firstName: yup.string().when("role", (role, schema) => {
        return (role[0] === roleTypes.contractor && existingContractor) ||
          role[0] === roleTypes.businessAccount
          ? schema.notRequired()
          : schema.required("First Name is required");
      }),
      lastName: yup.string().when("role", (role, schema) => {
        return (role[0] === roleTypes.contractor && existingContractor) ||
          role[0] === roleTypes.businessAccount
          ? schema.notRequired()
          : schema.required("Last Name is required");
      }),
      email: yup.string().when("role", (role, schema) => {
        return role[0] === roleTypes.contractor && existingContractor
          ? schema.notRequired()
          : schema.required("Email is required");
      }),
      phoneNumber: yup.string().notRequired(),
      password: yup.string().when("role", (role, schema) => {
        return context === routeContextType.edit
          ? yup.string()
          : [roleTypes.businessAccount].includes(role[0])
          ? yup.string().required("Password is required")
          : yup.string();
      }),
      confirmPassword: yup.string().when("role", (role, schema) => {
        return context === routeContextType.edit
          ? yup.string()
          : [roleTypes.businessAccount].includes(role[0])
          ? yup
              .string()
              .oneOf([yup.ref("password"), null], "Passwords must match")
              .required("Confirm Password is required")
          : yup.string();
      }),
    })
    .required();

const farms = [
  { value: "AEDICESA", label: "AEDICESA - Farm ABC" },
  { value: "BBFSCESA", label: "BBFSCESA - Farm BBF" },
  { value: "TUDICESA", label: "TUDICESA - Farm TUD" },
  { value: "JE2322SA", label: "JE2322SA - Farm JE2" },
  { value: "HYTICESA", label: "HYTICESA - Farm HYT" },
  { value: "KJDICESA", label: "KJDICESA - Farm KJD" },
];

const businessAccountsOptions = [
  {
    value: "65864a0ff19fa10008bfddd8",
    label: "Business XYZ",
  },
];

const AddOrEditUser = ({ context }) => {
  const history = useHistory();
  let query = useQueryParams();
  const farmIdParam = query.get("farmId");
  const { userId } = useParams();
  const { user } = useSelector((state) => state.user);
  const currentUserRole = user?.user?.role;
  const [existingContractorState, setExistingContractorState] = useState(null);
  const currentBusinessAccount = {
    _id: user?.user?._id,
    name: user?.user?.businessAccountName,
  };
  const initialFormState = {
    role: "",
    businessAccountRef: "",
    contractorBusinessAccountRefs: [],
    businessAccountName: "",
    farmId: "",
    contractorFarmId: [],
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    resetField,
    formState,
  } = useForm({
    resolver: yupResolver(schema(context, existingContractorState)),
    defaultValues: initialFormState,
  });
  const selectedRole = watch("role");
  const selectedBusinessAccount = watch("businessAccountRef");
  const contractorBusinessAccountRefs = watch("contractorBusinessAccountRefs");
  const contractorFarmId = watch("contractorFarmId");
  const existingContractor = watch("existingContractor");
  const [profilePictureState, setProfilePictureState] = useState({
    file: null,
    imagePreview: "",
    error: "",
  });
  const [rolesList, setRolesList] = useState([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isContractorBusinessSet, setIsContractorBusinessSet] = useState(false);
  const [isContractorFarmsSet, setIsContractorFarmsSet] = useState(false);

  const { data: businessAccountsData, isLoading: businessAccountsLoading } =
    useBusinessAccounts();

  const {
    data: farmsByBusinessAccountRefData,
    isLoading: farmsByBusinessAccountRefLoading,
  } = useFarmsByBusinessAccountRef(selectedBusinessAccount); // Get Farm of single business acc

  const {
    data: farmsByBusinessAccountsData,
    isLoading: farmsByBusinessAccountsLoading,
    refetch: farmsByBusinessAccountsRefetch,
  } = useGetFarmsByBusinessAccounts(contractorBusinessAccountRefs); // Get farms of multiple business acc

  const { data: farmByIdData } = useFarmById(farmIdParam);
  const { data: userIdData } = useUserById(userId);

  const { data: currentFarmRefOfUserData } = useCurrentFarmRefOfUser(
    userId,
    selectedBusinessAccount
  ); // Get single farm of current user

  const {
    data: getCurrentFarmsOfContractorData,
    isLoading: getCurrentFarmsOfContractorLoading,
    refetch: getCurrentFarmsOfContractorRefetch,
  } = useGetCurrentFarmsOfContractor({
    userRef: userIdData?._id,
    businessAccountRef: userIdData?.contractorBusinessAccountRefs,
  }); // Get multiple farms of current user

  const { data: allUsersData, isLoading: allUsersLoading } =
    useGetAllUsersByRole(selectedRole);

  const { mutate: createUserMutation } = useCreateUser();
  const { mutate: updateUserMutation } = useUpdateUser();
  const { mutate: deleteUserMutation, isLoading: deleteUserLoading } =
    useDeleteUser();
  const {
    mutate: deleteBusinessAccountPermanantlyData,
    isLoading: deleteBusinessAccountPermanantlyLoading,
  } = useDeleteBusinessAccountPermanantly();

  const formFieldsConfig = (selectedRole, currentUserRole) => [
    {
      name: "role",
      label: "Role",
      isRequired: true,
      type: controlTypes.select,
      options: rolesList,
      placeholder: "Select role",
      isVisible: true,
      isDisabled: context === routeContextType.edit,
      className: "col-span-2",
    },
    {
      name: "businessAccountRef",
      label: "Business Account",
      isRequired: true,
      type: controlTypes.comboBox,
      options:
        businessAccountsData?.map((account) => ({
          value: account._id,
          label: account.businessAccountName,
        })) || [],
      placeholder: "Select business account",
      isVisible:
        currentUserRole === roleTypes.businessAccount ||
        [roleTypes.user, roleTypes.farmManager].includes(selectedRole) ||
        (farmIdParam && selectedBusinessAccount === roleTypes.contractor),
      isDisabled: currentUserRole === roleTypes.businessAccount || farmIdParam,
      className: "col-span-2",
      searchBy: "label",
    },
    {
      name: "contractorBusinessAccountRefs",
      label: "Business Account",
      isRequired: selectedRole === roleTypes.contractor,
      type: controlTypes.multiComboBox,
      options:
        businessAccountsData?.map((account) => ({
          value: account._id,
          label: account.businessAccountName,
        })) || [],
      placeholder: "Select business accounts",
      isVisible: selectedRole === roleTypes.contractor,
      isDisabled: farmIdParam,
      className: "col-span-2",
      searchBy: "label",
    },
    {
      name: "farmId",
      label: "Farm",
      isRequired: true,
      type: controlTypes.comboBox,
      options:
        farmsByBusinessAccountRefData?.map((farm) => ({
          value: farm.farmId,
          label: `${farm.farmId} - ${farm.title}`,
        })) || [],
      placeholder: "Select farm",
      isVisible:
        [roleTypes.user, roleTypes.farmManager].includes(selectedRole) ||
        (farmIdParam && selectedRole !== roleTypes.contractor),
      isDisabled: farmIdParam,
      className: "col-span-2",
      isLoading: farmsByBusinessAccountRefLoading,
    },
    {
      name: "contractorFarmId",
      label: "Contractor Farm",
      isRequired: selectedRole === roleTypes.contractor,
      type: controlTypes.multiComboBox,
      options:
        farmsByBusinessAccountsData?.map((farm) => ({
          value: farm.farmId,
          label: `${farm.farmId} - ${farm.title} (${farm.businessAccountRef.businessAccountName})`,
        })) || [],
      placeholder: "Select farm",
      isVisible: selectedRole === roleTypes.contractor,
      isDisabled: farmIdParam,
      className: "col-span-2",
      isLoading: farmsByBusinessAccountsLoading,
    },
    {
      name: "businessAccountName",
      label: "Business Account Name",
      isRequired: true,
      type: controlTypes.input,
      placeholder: "Business Account Name",
      isVisible: selectedRole === roleTypes.businessAccount,
      isDisabled: false,
      className: "col-span-2",
    },
    {
      name: "existingContractor",
      label: "Select Existing Contractor",
      isRequired: false,
      type: controlTypes.comboBox,
      options:
        allUsersData?.map((user) => ({
          value: user._id,
          label: `${user.fullName}`,
        })) || [],
      placeholder: "Select contractor",
      isVisible: selectedRole === roleTypes.contractor && farmIdParam && context !== routeContextType.edit,
      isDisabled: false,
      className: "col-span-2",
      isLoading: farmsByBusinessAccountRefLoading,
    },
    {
      name: "or_divider",
      className: "col-span-2 flex flex-col gap-y-4",
      type: controlTypes.render,
      isVisible: selectedRole === roleTypes.contractor && farmIdParam && context !== routeContextType.edit,
      render: () => (
        <div className="flex items-center my-2">
          <div className="border-t border-1 border-gray-400 flex-grow"></div>
          <div className="px-3 text-gray-800 text-sm">OR</div>
          <div className="border-t border-1 border-gray-400 flex-grow"></div>
        </div>
      ),
    },
    {
      name: "or_divider",
      className: "col-span-2 flex flex-col gap-y-4",
      type: controlTypes.render,
      isVisible: selectedRole === roleTypes.contractor && farmIdParam && context !== routeContextType.edit,
      render: () => (
        <h3 className="block text-md font-bold dark:text-white">
          {context === routeContextType.add
            ? "Create new Contractor"
            : "Update Contractor details"}
        </h3>
      ),
    },
    {
      name: "firstName",
      label: "First Name",
      isRequired: selectedRole !== roleTypes.contractor,
      type: controlTypes.input,
      inputType: "text",
      placeholder: "Enter your first name",
      isVisible: [
        roleTypes.user,
        roleTypes.farmManager,
        roleTypes.superAdmin,
        roleTypes.contractor,
      ].includes(selectedRole),
      isDisabled: false,
      className: "col-span-2 lg:col-span-1",
    },
    {
      name: "lastName",
      label: "Last Name",
      isRequired: selectedRole !== roleTypes.contractor,
      type: controlTypes.input,
      inputType: "text",
      placeholder: "Enter your last name",
      isVisible: [
        roleTypes.user,
        roleTypes.farmManager,
        roleTypes.superAdmin,
        roleTypes.contractor,
      ].includes(selectedRole),
      isDisabled: false,
      className: "col-span-2 lg:col-span-1",
    },
    {
      name: "email",
      label: "Email",
      isRequired: selectedRole !== roleTypes.contractor,
      type: controlTypes.input,
      inputType: "email",
      placeholder: "Enter your email",
      isVisible: true,
      isDisabled: false,
      className: "col-span-2",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      isRequired: false,
      type: controlTypes.phoneNumberInput,
      inputType: "email",
      placeholder: "",
      isVisible: true,
      isDisabled: false,
      className: "col-span-2",
    },
    {
      name: "password_info",
      className: "col-span-2 flex flex-col gap-y-4 mt-2",
      type: controlTypes.paragraph,
      isVisible: selectedRole !== roleTypes.businessAccount,
      render: () => (
        <>
          <hr />
          <p className="text-sm font-thin">
            <HiOutlineInformationCircle
              className="h-5 w-5 text-primary-main float-left"
              aria-hidden="true"
            />
            &nbsp; Note: If the password isn't set, then normal email
            verification will proceed otherwise User will login through this
            password without email verification process
          </p>
        </>
      ),
    },
    {
      name: "password",
      label: "Password",
      isRequired:
        context === routeContextType.edit
          ? false
          : selectedRole === roleTypes.businessAccount,
      type: controlTypes.input,
      inputType: "password",
      placeholder: "Enter password",
      isVisible: true,
      isDisabled: false,
      className: "col-span-2",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      isRequired:
        context === routeContextType.edit
          ? false
          : selectedRole === roleTypes.businessAccount,
      type: controlTypes.input,
      inputType: "password",
      placeholder: "Enter confirm password",
      isVisible: true,
      isDisabled: false,
      className: "col-span-2",
    },
    {
      name: "delete_section",
      className: "col-span-2 flex flex-col gap-y-4 mt-2",
      type: controlTypes.render,
      isVisible:
        context === routeContextType.edit &&
        ![roleTypes.businessAccount, roleTypes.superAdmin].includes(
          selectedRole
        ),
      render: () => (
        <>
          <hr />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">Delete this account</h1>
            <p>
              Once you delete the account, there is no going back. Please be
              certain.
            </p>

            <button
              onClick={() => handleDeleteuser(userId)}
              className="w-[108px] h-[40px] flex justify-center items-center text-red-500 border border-red-300 bg-red-100 hover:bg-red-200 disabled:bg-red-100 font-bold rounded-lg mt-4"
              disabled={deleteUserLoading}
            >
              {deleteUserLoading ? (
                <ButtonSpinner color="text-red-500" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </>
      ),
    },
    {
      name: "archive_section",
      className: "col-span-2 flex flex-col gap-y-4 mt-2",
      type: controlTypes.render,
      isVisible:
        context === routeContextType.edit &&
        [roleTypes.businessAccount].includes(selectedRole) &&
        !userIdData.isArchived,
      render: () => (
        <>
          <hr />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">Archive this account</h1>
            <p>
              Once you archive the account, all of the associated farms data
              won't be accessible.
            </p>

            <button
              onClick={() => handleDeleteuser(userId)}
              className="w-[108px] h-[40px] flex justify-center items-center text-red-500 border border-red-300 bg-red-100 hover:bg-red-200 disabled:bg-red-100 font-bold rounded-lg mt-4"
              disabled={deleteUserLoading}
            >
              {deleteUserLoading ? (
                <ButtonSpinner color="text-red-500" />
              ) : (
                "Archive"
              )}
            </button>
          </div>
        </>
      ),
    },
    {
      name: "unarchive_section",
      className: "col-span-2 flex flex-col gap-y-4 mt-2",
      type: controlTypes.render,
      isVisible:
        context === routeContextType.edit &&
        [roleTypes.businessAccount].includes(selectedRole) &&
        userIdData.isArchived,
      render: () => (
        <>
          <hr />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">Unarchive this account</h1>
            <p>
              Once you unarchive the account, all of the associated farms will
              be accessible.
            </p>

            <button
              onClick={() => handleDeleteuser(userId)}
              className="w-[108px] h-[40px] flex justify-center items-center text-gray-500 border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 font-bold rounded-lg mt-4"
              disabled={deleteUserLoading}
            >
              {deleteUserLoading ? (
                <ButtonSpinner color="text-gray-500" />
              ) : (
                "Unarchive"
              )}
            </button>
          </div>
        </>
      ),
    },
    {
      name: "delete_section",
      className: "col-span-2 flex flex-col gap-y-4 mt-2",
      type: controlTypes.render,
      isVisible:
        context === routeContextType.edit &&
        [roleTypes.businessAccount].includes(selectedRole),
      render: () => (
        <>
          <hr />
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">Delete this account</h1>
            <p>
              Once you delete the account, all of the associated farms data,
              users, farm managers will be deleted permanently. Contractor will
              be removed from this business.
            </p>

            <button
              type="button"
              onClick={() => handlePermanentDeleteuser(userId)}
              className="w-fit h-[40px] flex justify-center items-center text-red-500 border border-red-300 bg-red-100 hover:bg-red-200 disabled:bg-red-100 font-bold rounded-lg mt-4 px-6"
              disabled={deleteBusinessAccountPermanantlyLoading}
            >
              {deleteBusinessAccountPermanantlyLoading ? (
                <ButtonSpinner color="text-red-500" />
              ) : (
                "Delete permanently"
              )}
            </button>
          </div>
        </>
      ),
    },
  ];

  const getControlComponentByType = (type) => {
    switch (type) {
      case controlTypes.select:
        return Select;

      case controlTypes.comboBox:
        return ComboBox;

      case controlTypes.multiComboBox:
        return MultiComboBox;

      case controlTypes.input:
        return Input;

      case controlTypes.phoneNumberInput:
        return PhoneNumberInput;

      default:
        return Input;
    }
  };

  const handleDeleteuser = (userId) => {
    deleteUserMutation(userId, {
      onSuccess: (data) => {
        reset(initialFormState);
        toast.success("Request successful");
        setIsFormLoading(false);
        history.goBack();
      },
      onError: (error) => {
        toast.error(error.response.data.error);
        setIsFormLoading(false);
      },
    });
  };

  const handlePermanentDeleteuser = (userId) => {
    Swal.fire({
      title: "Are you sure you want to delete this account?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBusinessAccountPermanantlyData(userId, {
          onSuccess: (data) => {
            reset(initialFormState);
            toast.success("Request successful");
            setIsFormLoading(false);
            history.goBack();
          },
          onError: (error) => {
            toast.error(error.response.data.error);
            setIsFormLoading(false);
          },
        });
      }
    });
  };

  const onSubmit = (data) => {
    console.log(data);
    console.log(profilePictureState);

    setIsFormLoading(true);

    // For Contractor on Farm Manage User page
    if (farmIdParam) {
      updateUserMutation(
        { userId: userId, userData: removeEmptyFields(data) },
        {
          onSuccess: () => {
            reset(initialFormState);
            toast.success("User updated successfully");
            setIsFormLoading(false);
            history.goBack();
          },
          onError: (error) => {
            toast.error(error.response.data.error);
            setIsFormLoading(false);
          },
        }
      );
      return;
    }

    if (context === routeContextType.add) {
      createUserMutation(removeEmptyFields(data), {
        onSuccess: (data) => {
          reset(initialFormState);
          toast.success("User created successfully");
          setIsFormLoading(false);
          history.goBack();
        },
        onError: (error) => {
          toast.error(error.response.data.error);
          setIsFormLoading(false);
        },
      });
    } else {
      updateUserMutation(
        { userId: userId, userData: removeEmptyFields(data) },
        {
          onSuccess: () => {
            reset(initialFormState);
            toast.success("User updated successfully");
            setIsFormLoading(false);
            history.goBack();
          },
          onError: (error) => {
            toast.error(error.response.data.error);
            setIsFormLoading(false);
          },
        }
      );
    }
  };

  const handleClose = () => {
    history.goBack();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureState({
          file,
          imagePreview: reader.result,
          error: "",
        });
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePictureState({
        ...profilePictureState,
        imagePreview: null,
      });
    }
  };

  const handleContractorFarm = () => {
    setValue(
      "contractorFarmId",
      getCurrentFarmsOfContractorData.map((farm) => ({
        value: farm.farmId,
        label: `${farm.farmId} - ${farm.title}`,
      }))
    );
  };

  useEffect(() => {
    if (
      currentUserRole !== roleTypes.businessAccount &&
      !userId &&
      !farmIdParam
    ) {
      reset({
        role: selectedRole,
        businessAccountRef: "",
        businessAccountName: "",
        farmId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [selectedRole, currentUserRole, farmIdParam, userId, reset]);

  useEffect(() => {
    let roles = Object.entries(allRoles).map(([value, label]) => ({
      value,
      label,
    }));
    if (currentUserRole === roleTypes.businessAccount || farmIdParam) {
      roles = roles.filter(
        (role) =>
          role.value !== roleTypes.superAdmin &&
          role.value !== roleTypes.businessAccount
      );
    }

    setRolesList(roles);
  }, [currentUserRole, farmIdParam]);

  useEffect(() => {
    if (currentUserRole === roleTypes.businessAccount) {
      setValue("businessAccountRef", currentBusinessAccount._id);
    }
  }, [currentUserRole, currentBusinessAccount._id, setValue]);

  useEffect(() => {
    if (farmByIdData) {
      setValue(
        "businessAccountRef",
        farmByIdData?.farm?.businessAccountRef._id
      );
      setValue("farmId", farmIdParam);
    }
  }, [farmByIdData, farmIdParam, selectedRole, setValue]);

  useEffect(() => {
    if (userIdData) {
      setValue("role", userIdData.role);
      setValue("firstName", userIdData.firstName);
      setValue("businessAccountRef", userIdData.businessAccountRef);
      setValue("businessAccountName", userIdData.businessAccountName);
      setValue("lastName", userIdData.lastName);
      setValue("email", userIdData.email);
      setValue("phoneNumber", userIdData.phoneNumber);
    }
  }, [setValue, userIdData]);

  useEffect(() => {
    if (currentFarmRefOfUserData) {
      setValue("farmId", currentFarmRefOfUserData.farmId);
    }
  }, [currentFarmRefOfUserData, setValue]);

  useEffect(() => {
    if (selectedRole === roleTypes.contractor && farmByIdData && context === routeContextType.add) {
      const { farm } = farmByIdData;
      const businessAccount = farmByIdData.farm.businessAccountRef;

      setValue("contractorBusinessAccountRefs", [
        {
          value: businessAccount._id,
          label: businessAccount.businessAccountName,
        },
      ]);

      setValue("contractorFarmId", [
        {
          value: farm.farmId,
          label: `${farm.farmId} - ${farm.title} (${farm.businessAccountRef.businessAccountName})`,
        },
      ]);
    }
  }, [selectedRole, farmByIdData, context, setValue]);

  useEffect(() => {
    // Setting multiple business accounts for contractor
    if (
      userIdData &&
      businessAccountsData?.length > 0 &&
      selectedRole === roleTypes.contractor
    ) {
      setValue(
        "contractorBusinessAccountRefs",
        userIdData?.contractorBusinessAccountRefs.map((elem) => ({
          value: elem._id,
          label: elem.businessAccountName,
        })) || []
      );
      setIsContractorBusinessSet(true);
    }
  }, [userIdData, businessAccountsData, selectedRole, setValue]);

  useEffect(() => {
    if (getCurrentFarmsOfContractorData) {
      setValue("contractorFarmId", getCurrentFarmsOfContractorData);
      setIsContractorFarmsSet(true);
    }
  }, [getCurrentFarmsOfContractorData, setValue]);

  useEffect(() => {
    if (farmsByBusinessAccountsLoading) return;

    if (context === routeContextType.edit) {
      if (
        !isContractorBusinessSet ||
        !isContractorFarmsSet ||
        !userIdData ||
        !getCurrentFarmsOfContractorData
      )
        return;
    }

    const businessIds = (contractorBusinessAccountRefs || []).map(
      (elem) => elem.value
    );

    const farmsListOfSelectedBusinesses = (farmsByBusinessAccountsData || [])
      .filter((farm) => businessIds.includes(farm.businessAccountRef._id))
      .map((farm) => farm.farmId);

    setValue(
      "contractorFarmId",
      farmsListOfSelectedBusinesses.length > 0
        ? contractorFarmId.filter((farm) =>
            farmsListOfSelectedBusinesses.includes(farm.value)
          )
        : []
    );
  }, [
    isContractorBusinessSet,
    userIdData,
    getCurrentFarmsOfContractorData,
    contractorBusinessAccountRefs,
    farmsByBusinessAccountsData,
    farmsByBusinessAccountsLoading,
    isContractorFarmsSet,
    farmIdParam,
    setValue,
  ]);

  useEffect(() => {
    if (
      selectedRole === roleTypes.contractor &&
      context === routeContextType.add &&
      contractorBusinessAccountRefs === undefined &&
      !farmIdParam
    ) {
      setValue("contractorBusinessAccountRefs", []);
    }
  }, [contractorBusinessAccountRefs, selectedRole, farmIdParam]);

  useEffect(() => {
    if (existingContractor) setExistingContractorState(existingContractor);
  }, [existingContractor]);

  return (
    <>
      <Prompt
        when={formState.isDirty}
        message="Are you sure you want to leave?"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerComponent
          isOpen={true}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          title={context === routeContextType.add ? "Add User" : "Edit User"}
          loading={
            isFormLoading ||
            deleteUserLoading ||
            deleteBusinessAccountPermanantlyLoading
          }
        >
          <ProfilePictureSelector
            imagePreview={profilePictureState.imagePreview}
            error={profilePictureState.error}
            onImageChange={handleImageChange}
            disabled={isFormLoading}
          />

          <div className="grid grid-cols-2 gap-x-2 gap-y-4 max-w-xl">
            {formFieldsConfig(
              selectedRole,
              currentUserRole,
              rolesList,
              businessAccountsOptions,
              farms,
              contractorFarmId
            ).map((field, index) => {
              if (!field.isVisible) return null;
              if (!!field.render) {
                return <div className={field.className}>{field.render()}</div>;
              }

              const FieldComponent = getControlComponentByType(field.type);

              return (
                <div key={index} className={field.className}>
                  <label
                    htmlFor="input-label"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    {field.label}&nbsp;
                    {field.isRequired && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>

                  <Controller
                    key={index}
                    name={field.name}
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name },
                      fieldState: { error },
                    }) => (
                      <FieldComponent
                        type={field?.inputType}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        error={error}
                        options={field?.options}
                        placeholder={field?.placeholder}
                        disabled={field.isDisabled || isFormLoading}
                        loading={field?.isLoading}
                        searchBy={field?.searchBy}
                      />
                    )}
                  />
                </div>
              );
            })}
          </div>
        </DrawerComponent>
      </form>
    </>
  );
};

export default AddOrEditUser;

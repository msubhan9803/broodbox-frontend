/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import DrawerComponent from "components/DrawerComponent";
import ComboBox from "components/common/controls/ComboBox";
import Input from "components/common/controls/Input";
import Select from "components/common/controls/Select";
import PhoneNumberInput from "components/common/controls/PhoneNumber";
import Tabs from "components/common/Tabs";
import AllowdModuleCheck from "components/userManagement/AllowdModuleCheck";
import ScreenListAccordion from "components/userManagement/ScreenListAccordion";
import { allRoles, controlTypes, routeContextType } from "utils/constants";
import {
  useAllModules,
  useGetPrivilegesByRoleNameWithoutPopulation,
  useUpdateRolePrivileges,
} from "hooks/useUserManagement";

const schema = yup
  .object({
    role: yup.string().required("Role is required"),
  })
  .required();

const EditRole = ({ context }) => {
  const history = useHistory();
  let { roleName } = useParams();
  const initialFormState = {
    role: "",
    moduleList: [],
  };
  const { handleSubmit, control, setValue, watch, reset, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialFormState,
  });
  const existingModuleList = watch("moduleList");
  const allFormState = watch();
  let roles = Object.entries(allRoles).map(([value, label]) => ({
    value,
    label,
  }));
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [moduleTab, setModuleTab] = useState(0);
  const [currentSelectedModule, setCurrentSelectedModule] = useState(0);
  const { data: allModulessData } = useAllModules();
  const {
    data: privilegesByRoleNameData,
    refetch: privilegesByRoleNameRefetch
  } = useGetPrivilegesByRoleNameWithoutPopulation(roleName);
  const { mutate: updateRolePrivileges } = useUpdateRolePrivileges();
  const modulesNameList =
    allModulessData?.modules
      .sort((a, b) => a.order - b.order)
      .map((module) => module.label) || [];

  const getModuleObjByModuleRef = (moduleRef) => {
    const module = allModulessData?.modules.find(
      (module) => module._id === moduleRef
    );

    return module;
  };

  const getModuleObjByLabel = (label) => {
    const module = allModulessData?.modules.find(
      (module) => module.label === label
    );

    return module;
  };

  const checkModuleExistence = (moduleRef) => {
    const isExisting = existingModuleList.some(
      (module) => module.moduleRef === moduleRef
    );
    return isExisting;
  };

  const getScreensStateByModuleRef = (moduleRef) => {
    const screenList =
      existingModuleList.find((module) => module.moduleRef === moduleRef)
        ?.screenList || [];
    return screenList;
  };

  const getAllScreensByModuleRef = (moduleRef) => {
    const screenList =
      allModulessData?.modules.find((module) => module._id === moduleRef)
        ?.screens || [];
    return screenList;
  };

  const handleModuleOnChange = (moduleRef) => {
    const isExisting = existingModuleList.some(
      (module) => module.moduleRef === moduleRef
    );

    let moduleListTemp = [];
    if (isExisting) {
      moduleListTemp = existingModuleList.filter(
        (mod) => mod.moduleRef !== moduleRef
      );
    } else {
      moduleListTemp = [
        ...existingModuleList,
        {
          moduleRef: moduleRef,
          screenList: [],
        },
      ];
    }

    setValue("moduleList", moduleListTemp);
  };

  const handleScreenStateUpdate = (moduleRef, screenRef) => {
    let formModuleState = [...allFormState.moduleList];

    const moduleIndex = allFormState.moduleList.findIndex(
      (module) => module.moduleRef === moduleRef
    );

    if (moduleIndex === -1) {
      console.log("Module not found");
      return;
    }

    let module = allFormState.moduleList[moduleIndex];

    let screen = module.screenList.find(
      (screen) => screen.screenRef === screenRef
    );

    if (!screen) {
      screen = { screenRef, actionList: [] };
      module.screenList.push(screen);
    } else {
      module.screenList = module.screenList.filter(
        (screen) => screen.screenRef !== screenRef
      )
    }

    formModuleState[moduleIndex] = module;

    setValue("moduleList", formModuleState);
  };

  const handleModuleStateUpdate = (moduleRef, screenRef, actionRef) => {
    let formModuleState = [...allFormState.moduleList];

    const moduleIndex = allFormState.moduleList.findIndex(
      (module) => module.moduleRef === moduleRef
    );

    if (moduleIndex === -1) {
      console.log("Module not found");
      return;
    }

    let module = allFormState.moduleList[moduleIndex];

    // Find the screen by screenRef
    let screen = module.screenList.find(
      (screen) => screen.screenRef === screenRef
    );

    // If screenRef does not exist, insert the screenRef into screenList
    if (!screen) {
      screen = { screenRef, actionList: [] };
      module.screenList.push(screen);
    }

    // Find the action by actionRef
    const actionIndex = screen.actionList.findIndex(
      (action) => action.actionRef === actionRef
    );

    // If actionRef does not exist, insert it
    if (actionIndex === -1) {
      screen.actionList.push({ actionRef });
    } else {
      // If actionRef exists, remove it
      screen.actionList.splice(actionIndex, 1);

      // If actionList becomes empty, remove the screenRef as well
      if (screen.actionList.length === 0) {
        const screenIndex = module.screenList.findIndex(
          (screen) => screen.screenRef === screenRef
        );
        if (screenIndex !== -1) {
          module.screenList.splice(screenIndex, 1);
        }
      }
    }

    formModuleState[moduleIndex] = module;

    setValue("moduleList", formModuleState);
  };

  const handleScreenRefExistCheck = (moduleRef, screenRef) => {
    const module = allFormState.moduleList.find(
      (module) => module.moduleRef === moduleRef
    );
    if (!module) {
      return false;
    }

    const screen = module.screenList.find(
      (screen) => screen.screenRef === screenRef
    );
    if (!screen) {
      return false;
    }

    return true;
  };

  const handleActionRefExistCheck = (moduleRef, screenRef, actionRef) => {
    // Find the module by moduleRef
    const module = allFormState.moduleList.find(
      (module) => module.moduleRef === moduleRef
    );
    if (!module) {
      return false;
    }

    // Find the screen by screenRef
    const screen = module.screenList.find(
      (screen) => screen.screenRef === screenRef
    );
    if (!screen) {
      return false;
    }

    // Check if the actionRef exists in the actionList
    return screen.actionList.some((action) => action.actionRef === actionRef);
  };

  const formFieldsConfig = (
    currentSelectedModule,
    _existingModuleList,
    _checkModuleExistence,
    _getScreensStateByModuleRef,
    _getAllScreensByModuleRef,
    _handleModuleStateUpdate,
    _handleActionRefExistCheck,
    _handleScreenStateUpdate,
    _handleScreenRefExistCheck
  ) => [
    {
      isField: true,
      name: "role",
      label: "Role",
      isRequired: true,
      type: controlTypes.select,
      options: roles,
      placeholder: "Select role",
      isVisible: true,
      isDisabled: context === routeContextType.edit,
      className: "col-span-2",
    },
    {
      isField: false,
      options: modulesNameList,
      isVisible: true,
      render: (data) => (
        <Tabs
          tabs={data.map((elem) => ({ label: elem }))}
          currentTab={moduleTab}
          setCurrentTab={setModuleTab}
        />
      ),
      className: "col-span-2",
    },
    {
      isField: false,
      isVisible: true,
      render: () => (
        <AllowdModuleCheck
          moduleRef={currentSelectedModule?._id}
          existingModuleList={_existingModuleList}
          handleOnChange={handleModuleOnChange}
          checkModuleExistence={_checkModuleExistence}
        />
      ),
      className: "col-span-2",
    },
    {
      isField: false,
      isVisible: true,
      render: () => (
        <ScreenListAccordion
          currentSelectedModule={currentSelectedModule}
          _checkModuleExistence={_checkModuleExistence}
          _getAllScreensByModuleRef={_getAllScreensByModuleRef}
          _handleModuleStateUpdate={_handleModuleStateUpdate}
          _handleActionRefExistCheck={_handleActionRefExistCheck}
          _handleScreenStateUpdate={_handleScreenStateUpdate}
          _handleScreenRefExistCheck={_handleScreenRefExistCheck}
        />
      ),
      className: "col-span-2",
    },
  ];

  const getControlComponentByType = (type) => {
    switch (type) {
      case controlTypes.select:
        return Select;

      case controlTypes.comboBox:
        return ComboBox;

      case controlTypes.input:
        return Input;

      case controlTypes.phoneNumberInput:
        return PhoneNumberInput;

      default:
        return Input;
    }
  };

  const onSubmit = (data) => {
    console.log(data);

    const modulesWithEmptyScreenList = data.moduleList
      .filter((module) => module.screenList.length === 0)
      .map((module) => {
        const moduleObj = getModuleObjByModuleRef(module.moduleRef);
        return moduleObj?.label;
      });

    if (modulesWithEmptyScreenList.length > 0) {
      const moduleNames = modulesWithEmptyScreenList.join(", ");
      toast.error(
        `The following modules have an empty screen list: ${moduleNames}`
      );
      setIsFormLoading(false);
      return;
    }

    setIsFormLoading(true);

    updateRolePrivileges(data, {
      onSuccess: () => {
        reset(initialFormState);
        toast.success("Role privileges updated");
        setIsFormLoading(false);
        history.goBack();
      },
      onError: (error) => {
        toast.error(error.response.data.error);
        setIsFormLoading(false);
      },
    });
  };

  const handleClose = () => {
    history.goBack();
  };

  useEffect(() => {
    if ((moduleTab, modulesNameList.length > 0)) {
      const temp = getModuleObjByLabel(modulesNameList[moduleTab]);
      setCurrentSelectedModule(temp);
    }
  }, [moduleTab, modulesNameList]);

  useEffect(() => {
    if (roleName) {
      setValue("role", roleName);
      privilegesByRoleNameRefetch();
    }
  }, [roleName, setValue]);

  useEffect(() => {
    if (privilegesByRoleNameData?.moduleList?.length > 0 && roleName) {
      setValue("role", roleName);
      setValue("moduleList", privilegesByRoleNameData.moduleList);
    }
  }, [privilegesByRoleNameData, roleName]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerComponent
          isOpen={true}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          title="Edit Role"
          loading={isFormLoading}
        >
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-w-xl">
            {formFieldsConfig(
              currentSelectedModule,
              existingModuleList,
              checkModuleExistence,
              getScreensStateByModuleRef,
              getAllScreensByModuleRef,
              handleModuleStateUpdate,
              handleActionRefExistCheck,
              handleScreenStateUpdate,
              handleScreenRefExistCheck
            ).map((field, index) => {
              if (!field.isVisible) return null;

              if (!field.isField) {
                return (
                  <div className={field.className}>
                    {field.options
                      ? field.render(field.options)
                      : field.render()}
                  </div>
                );
              }

              const FieldComponent = getControlComponentByType(field.type);

              return (
                <div className={field.className}>
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

export default EditRole;

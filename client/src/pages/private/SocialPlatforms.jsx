import React, { Fragment, useEffect } from "react";
import { apiEndpoints } from "../../api";
import { useForm, useFieldArray } from "react-hook-form";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import useVisibilities from "../../hooks/useVisibilities";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";

export default function SocialPlatforms() {
  const { visibilities } = useVisibilities();

  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: { errors, isSubmitting },
  } = useForm();

  const { fields } = useFieldArray({
    control,
    name: "socialPlatforms",
  });

  const fetchUserSocialPlatforms = async () => {
    try {
      const res = await apiEndpoints.getUserSocialPlatforms();

      const data = res.data;

      reset({ socialPlatforms: data });
      console.log("User Social Platforms: ", data);
    } catch (error) {
      console.error("Error fetching User Social Platforms: ", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await apiEndpoints.manageUserSocialPlatforms({
        platforms: data?.socialPlatforms,
      });
      fetchUserSocialPlatforms();
    } catch (error) {
      console.error("Error updating User Social Platforms: ", error);
    }
  };

  useEffect(() => {
    fetchUserSocialPlatforms();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-6 p-3 text-sm border-b border-gray-500"
    >
      {fields.map((item, index) => (
        <div key={item._id} className="col-span-12 grid grid-cols-12 gap-6">
          <LabelInput
            id={`socialPlatforms.${index}.name`}
            label="Platform Name"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            required
          >
            <CustomInput
              id={`socialPlatforms.${index}.name`}
              type="text"
              placeholder={`Enter Platform name`}
              {...register(`socialPlatforms.${index}.name`)}
              error={errors.socialPlatforms?.[index]?.name}
            />
          </LabelInput>

          <LabelInput
            id={`socialPlatforms.${index}.link`}
            label="Link"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            required
          >
            <CustomInput
              id={`socialPlatforms.${index}.link`}
              type="text"
              placeholder={`Enter ${item.name} link`}
              {...register(`socialPlatforms.${index}.link`)}
              error={errors.socialPlatforms?.[index]?.link}
            />
          </LabelInput>

          <LabelInput
            id={`socialPlatforms.${index}.visibility`}
            label="Visibility"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
            required
          >
            <CustomRadioButtons
              id={`socialPlatforms.${index}.visibility`}
              name="visibility"
              options={visibilities}
              {...register(`socialPlatforms.${index}.visibility`, {
                required: "Visibility is required!",
              })}
              error={errors.socialPlatforms?.[index]?.visibility}
            />
          </LabelInput>
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="col-span-12 place-self-end w-fit px-5 py-2 text-white bg-blue-500 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Saving" : "Save"}
      </button>
    </form>
  );
}

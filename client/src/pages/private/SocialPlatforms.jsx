import React, { Fragment, useEffect } from "react";
import { apiEndpoints } from "../../api";
import { useForm, useFieldArray } from "react-hook-form";
import LabelInput from "../../components/ui/LabelInput";
import CustomInput from "../../components/ui/CustomInput";
import CustomSelect from "../../components/ui/CustomSelect";
import useVisibilities from "../../hooks/useVisibilities";
import CustomRadioButtons from "../../components/ui/CustomRadioButtons";
import { Trash2 } from "lucide-react";

const SOCIAL_APPS_LIST = [
  {
    id: 61,
    title: "Facebook",
    category: "Social",
    route: "https://svgl.app/library/facebook-icon.svg",
    wordmark: "https://svgl.app/library/facebook-wordmark.svg",
    url: "https://www.facebook.com",
    brandUrl: "https://about.meta.com/brand/resources/facebook/logo",
  },
  {
    id: 62,
    title: "Twitter",
    category: "Social",
    route: "https://svgl.app/library/twitter.svg",
    url: "https://twitter.com/",
  },
  {
    id: 78,
    title: "YouTube",
    category: ["Google", "Social"],
    route: "https://svgl.app/library/youtube.svg",
    wordmark: {
      light: "https://svgl.app/library/youtube-wordmark-light.svg",
      dark: "https://svgl.app/library/youtube-wordmark-dark.svg",
    },
    url: "https://www.youtube.com",
    brandUrl: "https://brand.youtube",
  },
  {
    id: 85,
    title: "LinkedIn",
    category: "Social",
    route: "https://svgl.app/library/linkedin.svg",
    url: "https://www.linkedin.com/",
    brandUrl: "https://brand.linkedin.com/",
  },
  {
    id: 86,
    title: "Telegram",
    category: "Social",
    route: "https://svgl.app/library/telegram.svg",
    url: "https://web.telegram.org/",
  },
  {
    id: 87,
    title: "Matrix",
    category: "Social",
    route: {
      light: "https://svgl.app/library/matrix-light.svg",
      dark: "https://svgl.app/library/matrix-dark.svg",
    },
    url: "https://matrix.org/",
  },
  {
    id: 88,
    title: "WhatsApp",
    category: "Social",
    route: "https://svgl.app/library/whatsapp-icon.svg",
    wordmark: "https://svgl.app/library/whatsapp-wordmark.svg",
    url: "https://web.whatsapp.com",
    brandUrl: "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand",
  },
  {
    id: 110,
    title: "Arc",
    category: "Social",
    route: {
      light: "https://svgl.app/library/arc.svg",
      dark: "https://svgl.app/library/arc_dark.svg",
    },
    url: "https://arc.dev",
  },
  {
    id: 215,
    title: "Mastodon",
    category: "Social",
    route: "https://svgl.app/library/mastodon.svg",
    url: "https://joinmastodon.org/",
  },
  {
    id: 229,
    title: "Messenger",
    category: "Social",
    route: "https://svgl.app/library/messenger.svg",
    url: "https://www.messenger.com/",
  },
  {
    id: 248,
    title: "Infojobs",
    category: "Social",
    route: "https://svgl.app/library/infojobs-logo.svg",
    url: "https://www.infojobs.net/",
  },
  {
    id: 252,
    title: "Skype",
    category: "Social",
    route: "https://svgl.app/library/skype.svg",
    url: "https://www.skype.com/",
  },
  {
    id: 261,
    title: "Threads",
    category: "Social",
    route: {
      light: "https://svgl.app/library/threads.svg",
      dark: "https://svgl.app/library/threads_dark.svg",
    },
    url: "https://threads.net/",
  },
  {
    id: 262,
    title: "Instagram",
    category: "Social",
    route: "https://svgl.app/library/instagram-icon.svg",
    wordmark: "https://svgl.app/library/instagram-wordmark.svg",
    url: "https://www.instagram.com/",
    brandUrl: "https://about.instagram.com/brand",
  },
  {
    id: 284,
    title: "X (formerly Twitter)",
    category: "Social",
    route: {
      light: "https://svgl.app/library/x.svg",
      dark: "https://svgl.app/library/x_dark.svg",
    },
    url: "https://x.com",
    brandUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
  },
  {
    id: 293,
    title: "VK",
    category: "Social",
    route: "https://svgl.app/library/vk.svg",
    url: "https://vk.com",
  },
  {
    id: 313,
    title: "Hashnode",
    category: "Social",
    route: "https://svgl.app/library/hashnode.svg",
    url: "https://hashnode.com",
  },
  {
    id: 317,
    title: "Patreon",
    category: "Social",
    route: {
      light: "https://svgl.app/library/patreon.svg",
      dark: "https://svgl.app/library/patreon_dark.svg",
    },
    url: "https://www.patreon.com/",
  },
  {
    id: 318,
    title: "Peerlist",
    category: "Social",
    route: "https://svgl.app/library/peerlist.svg",
    url: "https://www.peerlist.io/",
  },
  {
    id: 343,
    title: "Pinterest",
    category: "Social",
    route: "https://svgl.app/library/pinterest.svg",
    url: "https://pinterest.com/",
  },
  {
    id: 353,
    title: "Reddit",
    category: "Social",
    route: "https://svgl.app/library/reddit.svg",
    url: "https://www.reddit.com/",
    brandUrl: "https://redditinc.com/brand",
  },
  {
    id: 404,
    title: "Meta",
    category: "Social",
    route: "https://svgl.app/library/meta.svg",
    url: "https://about.meta.com/es/",
    brandUrl: "https://about.meta.com/brand/resources/",
  },
  {
    id: 426,
    title: "TikTok",
    category: "Social",
    route: {
      light: "https://svgl.app/library/tiktok-icon-light.svg",
      dark: "https://svgl.app/library/tiktok-icon-dark.svg",
    },
    wordmark: {
      light: "https://svgl.app/library/tiktok-wordmark-light.svg",
      dark: "https://svgl.app/library/tiktok-wordmark-dark.svg",
    },
    url: "https://www.tiktok.com",
  },
  {
    id: 471,
    title: "Carrd",
    category: ["Social"],
    route: "https://svgl.app/library/carrd.svg",
    url: "https://carrd.co/",
  },
  {
    id: 475,
    title: "Bluesky",
    category: "Social",
    route: "https://svgl.app/library/bluesky.svg",
    url: "https://blueskyweb.xyz/",
  },
  {
    id: 477,
    title: "daily.dev",
    category: ["Social", "Community"],
    route: {
      light: "https://svgl.app/library/daily-dev-ligth.svg",
      dark: "https://svgl.app/library/daily-dev-dark.svg",
    },
    url: "https://daily.dev/",
  },
  {
    id: 542,
    title: "Zulip",
    category: ["Software", "Social"],
    route: "https://svgl.app/library/zulip.svg",
    wordmark: "https://svgl.app/library/zulip-wordmark.svg",
    url: "https://zulip.com/",
    brandUrl:
      "https://github.com/zulip/zulip/tree/bd29fb3e2691daef570ba5661351922a16782dd2/static/images/logo",
  },
];

const SOCIAL_APPS = SOCIAL_APPS_LIST.map((app) => ({
  value: app.title,
  label: app.title,
}));

export default function SocialPlatforms() {
  const { visibilities } = useVisibilities();

  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
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

  const deleteSocialAccount = async (id) => {
    try {
      await apiEndpoints.deleteUserSocialPlatform(id);

      fetchUserSocialPlatforms();
    } catch (error) {
      console.error("Error deleting Social Account: ", error);
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
            id={`socialPlatforms.${index}.sortOrder`}
            label="Sort Order"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <CustomInput
              id={`socialPlatforms.${index}.sortOrder`}
              type="number"
              min={0}
              placeholder="{`Enter ${item.name} Sort Order`}"
              {...register(`socialPlatforms.${index}.sortOrder`, { min: 0 })}
              error={errors.socialPlatforms?.[index]?.sortOrder}
            />
          </LabelInput>

          <LabelInput
            id={`socialPlatforms.${index}.visibility`}
            label="Visibility"
            colSpan="col-span-12 sm:col-span-6 lg:col-span-2"
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

          <div className="col-span-12 sm:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                item._id ? deleteSocialAccount(item._id) : remove(index)
              }
              className="mt-3 p-2 h-fit w-fit text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <div className="col-span-12 flex items-center justify-between gap-3">
        <div className="flex items-center justify-start gap-5">
          <button
            onClick={() =>
              append({
                name: "",
                link: "",
                visibility: "public", // or default value
                sortOrder: fields?.length,
              })
            }
            className="shrink-0 px-5 py-2 text-white bg-green-500 rounded-sm"
          >
            Add Custom Platform
          </button>

          <CustomSelect
            placeholder="Select Platfrom"
            options={[
              { value: "Select Platfrom", label: "Select Platfrom" },
              ...SOCIAL_APPS,
            ]}
            value="Select Platfrom"
            onChange={(value) =>
              append({
                name: value, // ✅ correct
                link: "",
                visibility: "public",
                sortOrder: fields?.length,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 justify-end text-white bg-blue-500 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Saving" : "Save"}
        </button>
      </div>
    </form>
  );
}

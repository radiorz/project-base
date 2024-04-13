const releaseOption = {
  vendor: {
    include: [
      {
        source: "",
        alias: "", // 倘若是只取不转这个也应该算 build/deploy的范畴.
      },
      "source",
    ],
    exclude: [],
  },
  projects: [
    {
      name: "",
      rootDir: "",
    },
    {
      name: "",
      rootDir: "",
    },
  ],
  releaseType: "JUST_APP",
  platform: "WINDOWS",
  outputOptions: {
    name: "",
    version: "", // 可以不指定
    isBeta: true,
    isDate: true,
    description: "",
  },
  packOptions: {
    type: ".zip",
  },
};

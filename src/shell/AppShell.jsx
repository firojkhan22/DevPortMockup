// src/shell/AppShell.jsx
// Provides (global): AppShell
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= APP SHELL / ROUTER ================= */
function AppShell({
  onLogout,
  storedCredId,
  setStoredCredId,
  passkeyEnabled,
  setPasskeyEnabled,
  passkeySignInEnabled,
  setPasskeySignInEnabled,
  verificationStage,
  setVerificationStage,
}) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (isScreenLocked(active, verificationStage)) {
      setActive(lockedRedirectTarget(verificationStage));
    }
  }, [verificationStage]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [summaryProject, setSummaryProject] = useState(null);
  // Project name to pre-filter the Disbursement Statement report
  // with, when it's opened from within a project (Loan Details tab
  // "Open Disbursement Statement report" button) rather than from
  // the MIS menu directly — the BRD's "integrated from project view
  // screen" requirement.
  const [statementProjectFilter, setStatementProjectFilter] = useState(null);
  // Project (and, when one exists, the specific query/document item)
  // to pre-select on the Respond to Queries screen when it's opened
  // from the Qry. Status column on All Projects — clicking a
  // project's query count should land straight on that project's
  // query, not a blank/unfiltered list.
  const [queriesProjectFilter, setQueriesProjectFilter] = useState(null);
  const [editingProjectLead, setEditingProjectLead] = useState(null);
  const [editingBankAccount, setEditingBankAccount] = useState(null);
  const [usersCompany, setUsersCompany] = useState(null);
  const [leadsEntryMode, setLeadsEntryMode] = useState("single");
  const [editingLead, setEditingLead] = useState(null);
  const [leads, setLeads] = useState(() => [
    {
      key: "l1",
      leadId: "LD100482",
      status: "Draft",
      leadType: "Non-BSA",
      bsaCode: "",
      project: "Riverside Heights",
      building: "",
      unitNumber: "A-204",
      firstName: "Amit",
      middleName: "",
      surname: "Sharma",
      email: "",
      mobile: "9876543210",
      employment: "",
      date: "18 Jul 2026",
    },
    {
      key: "l2",
      leadId: "LD100471",
      status: "In process",
      leadType: "Non-BSA",
      bsaCode: "",
      project: "Green Valley Phase 2",
      building: "",
      unitNumber: "",
      firstName: "Priya",
      middleName: "",
      surname: "Nair",
      email: "",
      mobile: "9876500000",
      employment: "",
      date: "15 Jul 2026",
    },
    {
      key: "l3",
      leadId: "LD100438",
      status: "Converted",
      leadType: "Non-BSA",
      bsaCode: "",
      project: "Riverside Heights",
      building: "",
      unitNumber: "",
      firstName: "Rohit",
      middleName: "",
      surname: "Verma",
      email: "",
      mobile: "9876511111",
      employment: "",
      date: "02 Jul 2026",
    },
  ]);
  // Draft: created here, not yet shared with the bank. Submitting
  // (either fresh or from an edited draft) is what actually pushes
  // it to the bank's lead-management system and assigns a real
  // Lead ID — matching "record created in database but yet not
  // shared with bank" until that point.
  function saveLeadAsDraft(data, existingKey) {
    setLeads((prev) => {
      if (existingKey) {
        return prev.map((l) =>
          l.key === existingKey ? { ...l, ...data, status: "Draft" } : l,
        );
      }
      return [
        {
          key: "l" + Date.now(),
          leadId: null,
          status: "Draft",
          date: "11 Aug 2026",
          ...data,
        },
        ...prev,
      ];
    });
  }
  function submitLeadToBank(data, existingKey) {
    const leadId = "LD" + Math.floor(100000 + Math.random() * 899999);
    const result = {
      leadId,
      project: data.project,
      projNo: projectNumberFor(data.project),
    };
    setLeads((prev) => {
      if (existingKey) {
        return prev.map((l) =>
          l.key === existingKey
            ? { ...l, ...data, status: "In process", leadId, date: "11 Aug 2026" }
            : l,
        );
      }
      return [
        {
          key: "l" + Date.now(),
          leadId,
          status: "In process",
          date: "11 Aug 2026",
          ...data,
        },
        ...prev,
      ];
    });
    return result;
  }
  function submitLeadsBulk(project, rows) {
    const newLeads = rows.map((r, i) => ({
      key: "l" + Date.now() + "-" + i,
      leadId: "LD" + Math.floor(100000 + Math.random() * 899999),
      status: "In process",
      date: "11 Aug 2026",
      leadType: "Non-BSA",
      bsaCode: r[9] || "",
      project: project,
      building: r[0] || "",
      unitNumber: r[1] || "",
      propertyNumber: r[2] || "",
      firstName: r[3] || "",
      middleName: r[4] || "",
      surname: r[5] || "",
      email: r[6] || "",
      mobile: r[7] || "",
      employment: r[8] || "",
    }));
    setLeads((prev) => [...newLeads, ...prev]);
  }

  // ---- Developer campaigns (BRD "Developers Campaign management") ----
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(() => [
    {
      key: "c1",
      name: "Riverside Heights Diwali Offer",
      projects: ["Riverside Heights"],
      audience: "HDFC Bank customers",
      offerType: "Rate discount",
      validFrom: "2026-10-01",
      validTo: "2026-11-30",
      championName: "Rahul Mehta",
      championContact: "9822011223",
      details: "8.30% p.a. special rate for HDFC customers booking during the festive period.",
      marketingFiles: ["Diwali_Offer_Poster.pdf", "Diwali_Offer_Social_Tile.jpg"],
      builderLetterFile: "Builder_Request_Letter.pdf",
      stage: "In Process",
    },
    {
      key: "c2",
      name: "Green Valley Launch Special",
      projects: ["Green Valley Phase 2"],
      audience: "All customers",
      offerType: "Fee waiver",
      validFrom: "2026-08-01",
      validTo: "",
      isOngoing: true,
      championName: "Priya Sharma",
      championContact: "9821012345",
      details: "Zero processing fee on all bookings — ongoing until the launch phase sells out.",
      marketingFiles: ["Launch_Special_Brochure.pdf"],
      builderLetterFile: "",
      stage: "Approved",
      remarks: "Approved by Central BD Coordinator — cleared for publishing.",
    },
    {
      key: "c3",
      name: "Emerald Enclave Cashback Weekend",
      projects: ["Emerald Enclave"],
      audience: "HDFC Bank customers",
      offerType: "Cashback",
      validFrom: "2026-07-05",
      validTo: "2026-07-07",
      championName: "Rahul Mehta",
      championContact: "9822011223",
      details: "₹50,000 cashback for bookings confirmed over the weekend event.",
      marketingFiles: ["Cashback_Weekend_Flyer.pdf"],
      builderLetterFile: "",
      stage: "Rejected",
      remarks: "Builder request letter missing — required since this targets HDFC Bank customers. Resubmit with the letter attached.",
    },
    {
      key: "c4",
      name: "ASP Ganpati Festival Offer",
      projects: ["ASP(906773)"],
      audience: "HDFC Bank customers",
      offerType: "Fee waiver",
      validFrom: "2026-08-20",
      validTo: "2026-09-10",
      championName: "Rahul Mehta",
      championContact: "9822011223",
      details: "Processing fee waived for bookings confirmed during the festival window.",
      marketingFiles: ["Ganpati_Offer_Banner.pdf"],
      builderLetterFile: "Builder_Letter_Draft_v1.pdf",
      stage: "Query Raised",
      queryText:
        "The builder letter attached is unsigned and the offer description doesn't specify which unit types this fee waiver applies to. Please re-upload a signed letter and clarify the description.",
      queryFields: ["details", "builderLetterFile"],
      queryHistory: [],
    },
  ]);
  function saveCampaignAsDraft(data, existingKey) {
    setCampaigns((prev) => {
      if (existingKey) {
        return prev.map((c) =>
          c.key === existingKey ? { ...c, ...data, stage: "Draft" } : c,
        );
      }
      return [
        { key: "c" + Date.now(), stage: "Draft", ...data },
        ...prev,
      ];
    });
  }
  function submitCampaignForApproval(data, existingKey) {
    const nextStage = "In Process";
    setCampaigns((prev) => {
      if (existingKey) {
        return prev.map((c) =>
          c.key === existingKey ? { ...c, ...data, stage: nextStage } : c,
        );
      }
      return [
        { key: "c" + Date.now(), stage: nextStage, ...data },
        ...prev,
      ];
    });
  }
  // Developer's response to a BD query — moves the campaign back to
  // In Process for another look, and keeps a record of what was
  // asked and how it was answered (visible later in the View modal).
  function respondToCampaignQuery(data, existingKey, responseText) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.key !== existingKey) return c;
        const historyEntry = {
          queryText: c.queryText,
          response: responseText,
        };
        return {
          ...c,
          ...data,
          stage: "In Process",
          queryText: null,
          queryFields: [],
          queryHistory: [...(c.queryHistory || []), historyEntry],
        };
      }),
    );
  }

  // Developer-initiated queries ("Queries I Raised") — lifted up here,
  // same pattern as campaigns/leads, so the list survives navigating
  // to the standalone "Raise a query" form and back.
  const [raisedQueries, setRaisedQueries] = useState(() => [
    {
      id: "Q-1042",
      category: "Document related",
      project: "Riverside Heights",
      document: "Occupation certificate",
      assignTo: "Legal Team",
      subject: "Which OC copy is required for Wing B",
      status: "Open",
      age: "2 days ago",
    },
    {
      id: "Q-1039",
      category: "General query",
      project: null,
      document: null,
      assignTo: "Not sure / general",
      subject: "Clarification on updated disbursement policy",
      status: "Open",
      age: "5 days ago",
    },
    {
      id: "Q-1031",
      category: "Project related",
      project: "Green Valley Phase 2",
      document: null,
      assignTo: "Technical Team",
      subject: "Status of RERA extension review",
      status: "Resolved",
      age: "1 week ago",
    },
  ]);
  function submitRaisedQuery(payload) {
    const categoryLabel =
      payload.category === "general"
        ? "General query"
        : payload.category === "project"
          ? "Project related"
          : "Document related";
    setRaisedQueries((prev) => [
      {
        id: "Q-" + (1043 + prev.length),
        category: categoryLabel,
        project: payload.project,
        document: payload.document,
        assignTo: payload.assignTo,
        subject: payload.subject,
        status: "Open",
        age: "Just now",
      },
      ...prev,
    ]);
  }

  const [editingUserForForm, setEditingUserForForm] = useState(null);
  const [builderUsers, setBuilderUsers] = useState(BUILDER_USERS_INITIAL);
  // Which seeded user this session is "logged in as" — this
  // prototype only has one real login, so this demo switch is how
  // you can see what a specific user (e.g. one with a lapsed
  // review) experiences after logging in.
  const [demoLoggedInUserId, setDemoLoggedInUserId] = useState("u1");
  const currentUser =
    builderUsers.find((u) => u.id === demoLoggedInUserId) || builderUsers[0];
  const currentUserFrozen = userReviewState(currentUser) === "frozen";
  // Creates a new user or updates an existing one in the shared
  // list — previously the Add/Edit User form only showed a local
  // "saved" confirmation without actually writing anywhere, so
  // nothing typed there (including middle name) ever reached the
  // User Management grid.
  function saveBuilderUser(data, existingId) {
    setBuilderUsers((prev) => {
      if (existingId) {
        return prev.map((u) =>
          u.id === existingId
            ? { ...u, ...data, modifiedOn: "11-Aug-2026" }
            : u,
        );
      }
      return [
        {
          id: "u" + Date.now(),
          isActive: true,
          firstAccess: false,
          createdOn: "11-Aug-2026",
          modifiedOn: "11-Aug-2026",
          kyc: "pending",
          lastReviewedOn: null,
          reviewDue: computeNextReviewDate(null),
          ...data,
        },
        ...prev,
      ];
    });
  }
  // Simulated email/system communications for the access-review
  // feature — a static prototype can't actually send mail, so this
  // stands in for what the "auto email communication" requirement
  // would trigger, visible in User Management.
  const [reviewCommsLog, setReviewCommsLog] = useState(() => {
    const log = [];
    BUILDER_USERS_INITIAL.forEach((u) => {
      const state = userReviewState(u);
      if (state === "due_soon") {
        log.push({
          to: u.email + " + admin",
          subject: "Access review due in " + daysUntilReview(u.reviewDue) + " day(s)",
          sentOn: "04-Aug-2026",
        });
      } else if (state === "frozen") {
        log.push({
          to: u.email + " + admin",
          subject: "Access frozen — review overdue since " + u.reviewDue,
          sentOn: "04-Aug-2026",
        });
      }
    });
    return log;
  });
  // Confirming keeps the user's current access and pushes the next
  // review out a quarter; revoking deactivates them. Either way this
  // is what "reviewing" a user means — verifying their access is
  // still relevant, per the User Management requirement.
  function reviewBuilderUser(userId, decision, accessData) {
    setBuilderUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const accessFields = accessData
          ? {
              access: accessData.access,
              selProjects: accessData.selProjects,
              selCompanies: accessData.selCompanies,
              selCities: accessData.selCities,
              accessValidTill: accessData.accessValidTill,
              creatorProjects: accessData.creatorProjects,
            }
          : {};
        if (decision === "revoke") {
          return {
            ...u,
            ...accessFields,
            isActive: false,
            lastReviewedOn: "04-Aug-2026",
            reviewDue: null,
          };
        }
        return {
          ...u,
          ...accessFields,
          isActive: true,
          lastReviewedOn: "04-Aug-2026",
          reviewDue: "04-Nov-2026",
        };
      }),
    );
    const u = builderUsers.find((x) => x.id === userId);
    if (u) {
      setReviewCommsLog((prev) => [
        {
          to: u.email + " + admin",
          subject:
            decision === "revoke"
              ? "Access revoked following review"
              : "Access confirmed — next review 04-Nov-2026",
          sentOn: "04-Aug-2026",
        },
        ...prev,
      ]);
    }
  }
  const mc = () => setMobileOpen(true);
  function navigateTo(id) {
    if (currentUserFrozen && ENTRY_UPDATE_SCREENS.has(id)) {
      setActive("accessRevoked");
      return;
    }
    setActive(
      isScreenLocked(id, verificationStage)
        ? lockedRedirectTarget(verificationStage)
        : id
    );
  }
  // Used by generic nav entry points (Home quick actions, sidebar)
  // that aren't the dedicated Edit buttons — makes sure "Create
  // Project (Lead)" always opens a blank wizard, never a leftover
  // edit-in-progress project from earlier in the session.
  function navigateFresh(id) {
    if (id === "newproject") setEditingProjectLead(null);
    navigateTo(id);
  }

  const screens = {
    home: <HomeScreen onMenuClick={mc} onNav={navigateFresh} />,
    dashboard: <DashboardScreen onMenuClick={mc} />,
    accessRevoked: (
      <AccessRevokedScreen
        onMenuClick={mc}
        onBack={() => navigateTo("home")}
      />
    ),
    profile: (
      <ProfileScreen
        onMenuClick={mc}
        onViewCompanyUsers={() => {
          setUsersCompany(null);
          setActive("companyUsers");
        }}
      />
    ),
    companyListing: (
      <CompanyListingScreen
        onMenuClick={mc}
        onAddCompany={() => navigateTo("companyEntry")}
        onEditCompany={() => navigateTo("companyEntry")}
        onViewUsers={(row) => {
          setUsersCompany(row);
          navigateTo("companyUsers");
        }}
      />
    ),
    developerProfile: <DeveloperProfileScreen onMenuClick={mc} />,
    companyUsers: (
      <CompanyUsersScreen
        onMenuClick={mc}
        company={usersCompany}
        backLabel={usersCompany ? "Company Listing" : "My Profile"}
        onBack={() => {
          const goTo = usersCompany ? "companyListing" : "profile";
          setUsersCompany(null);
          navigateTo(goTo);
        }}
      />
    ),
    companyEntry: (
      <CompanyEntryScreen
        onMenuClick={mc}
        onDone={() => navigateTo("companyListing")}
      />
    ),
    usersListing: (
      <UsersScreen
        onMenuClick={mc}
        onAddUser={() => {
          setEditingUserForForm(null);
          navigateTo("userForm");
        }}
        onEditUser={(row) => {
          setEditingUserForForm(row);
          navigateTo("userForm");
        }}
        users={builderUsers}
        onReviewUser={reviewBuilderUser}
      />
    ),
    userForm: (
      <UserFormScreen
        onMenuClick={mc}
        editUser={editingUserForForm}
        onDone={() => navigateTo("usersListing")}
        onSave={saveBuilderUser}
      />
    ),
    passkey: (
      <PasskeyScreen
        onMenuClick={mc}
        storedCredId={storedCredId}
        setStoredCredId={setStoredCredId}
        passkeySignInEnabled={passkeySignInEnabled}
        setPasskeySignInEnabled={setPasskeySignInEnabled}
      />
    ),
    allProjects: (
      <ProjectsScreen
        onMenuClick={mc}
        onAddProject={() => {
          setEditingProjectLead(null);
          navigateTo("newproject");
        }}
        onOpenProject={(row) => {
          setSummaryProject(row);
          navigateTo("projectSummary");
        }}
        onEditProject={(row) => {
          setEditingProjectLead(row);
          navigateTo("newproject");
        }}
        onOpenQueries={(row) => {
          setQueriesProjectFilter(row && row.q > 0 ? row.n : null);
          navigateTo("queries");
        }}
        verificationStage={verificationStage}
      />
    ),
    projectSummary: (
      <ProjectSummaryScreen
        onMenuClick={mc}
        onBack={() => navigateTo("allProjects")}
        project={summaryProject}
        onEdit={(row) => {
          setEditingProjectLead(row);
          navigateTo("newproject");
        }}
        onViewStatement={(projectName) => {
          setStatementProjectFilter(projectName || null);
          navigateTo("disbursementStatement");
        }}
      />
    ),
    projectNotifications: (
      <ProjectNotificationsScreen onMenuClick={mc} />
    ),
    newproject: (
      <NewProjectScreen
        onMenuClick={mc}
        editingProject={editingProjectLead}
        onDone={() => {
          setEditingProjectLead(null);
          navigateTo("allProjects");
        }}
      />
    ),
    queries: (
      <QueriesScreen
        onMenuClick={mc}
        initialProject={queriesProjectFilter}
      />
    ),
    myQueries: (
      <MyQueriesScreen
        onMenuClick={mc}
        raisedQueries={raisedQueries}
        onRaiseQuery={() => navigateTo("raiseQuery")}
      />
    ),
    raiseQuery: (
      <RaiseQueryScreen
        onMenuClick={mc}
        onDone={() => navigateTo("myQueries")}
        onSubmit={submitRaisedQuery}
      />
    ),
    bankListing: (
      <BankListingScreen
        onMenuClick={mc}
        onAddAccount={() => {
          setEditingBankAccount(null);
          navigateTo("bankEntry");
        }}
        onEditAccount={(row) => {
          setEditingBankAccount(row);
          navigateTo("bankEntry");
        }}
      />
    ),
    bankEntry: (
      <BankEntryScreen
        onMenuClick={mc}
        editingAccount={editingBankAccount}
        onDone={() => {
          setEditingBankAccount(null);
          navigateTo("bankListing");
        }}
      />
    ),
    rera: <RERAScreen onMenuClick={mc} />,
    oc: <OCScreen onMenuClick={mc} />,
    constructionFinance: <ConstructionFinanceScreen onMenuClick={mc} />,
    inventory: <InventoryScreen onMenuClick={mc} />,
    progress: <WorkProgressScreen onMenuClick={mc} />,
    unitdata: (
      <UnitDataScreen
        onMenuClick={mc}
        currentUserName={userFullName(currentUser)}
      />
    ),
    leadsListing: (
      <LeadsListingScreen
        onMenuClick={mc}
        leads={leads}
        onNewLead={() => {
          setLeadsEntryMode("single");
          setEditingLead(null);
          navigateTo("leadsEntry");
        }}
        onBulkUpload={() => {
          setLeadsEntryMode("bulk");
          setEditingLead(null);
          navigateTo("leadsEntry");
        }}
        onEditLead={(lead) => {
          setLeadsEntryMode("single");
          setEditingLead(lead);
          navigateTo("leadsEntry");
        }}
      />
    ),
    leadsEntry: (
      <LeadsEntryScreen
        onMenuClick={mc}
        onDone={() => navigateTo("leadsListing")}
        initialMode={leadsEntryMode}
        editingLead={editingLead}
        onSaveDraft={saveLeadAsDraft}
        onSubmitToBank={submitLeadToBank}
        onBulkSubmit={submitLeadsBulk}
      />
    ),
    campaignsListing: (
      <CampaignsListingScreen
        onMenuClick={mc}
        campaigns={campaigns}
        onNewCampaign={() => {
          setEditingCampaign(null);
          navigateTo("campaignsEntry");
        }}
        onEditCampaign={(c) => {
          setEditingCampaign(c);
          navigateTo("campaignsEntry");
        }}
      />
    ),
    campaignsEntry: (
      <CampaignEntryScreen
        onMenuClick={mc}
        onDone={() => navigateTo("campaignsListing")}
        editingCampaign={editingCampaign}
        onSaveDraft={saveCampaignAsDraft}
        onSubmitForApproval={submitCampaignForApproval}
        onRespondToQuery={respondToCampaignQuery}
      />
    ),
    bankcampaigns: <BankCampaignsScreen onMenuClick={mc} />,
    disbursementStatement: (
      <DisbursementStatementScreen
        onMenuClick={mc}
        initialProject={statementProjectFilter}
      />
    ),
    disbursement: <DisbursementScreen onMenuClick={mc} />,
    calculators: <CalculatorsScreen onMenuClick={mc} />,
    coordinators: <ProjectCoordinatorsScreen onMenuClick={mc} />,
    issueListing: (
      <IssueListingScreen
        onMenuClick={mc}
        onRaise={() => navigateTo("raiseIssue")}
      />
    ),
    raiseIssue: <RaiseIssueScreen onMenuClick={mc} />,
  };

  function cycleSidebar() {
    // expanded -> collapsed -> hidden -> expanded
    if (sidebarHidden) {
      setSidebarHidden(false);
      setSidebarCollapsed(false);
    } else if (sidebarCollapsed) {
      setSidebarHidden(true);
    } else {
      setSidebarCollapsed(true);
    }
  }

  return (
    <div className="d-flex">
      {!sidebarHidden && (
        <div className="d-none d-md-block" style={{ flexShrink: 0 }}>
          <Sidebar
            active={active}
            setActive={navigateFresh}
            onLogout={onLogout}
            passkeyEnabled={passkeyEnabled}
            collapsed={sidebarCollapsed}
            onToggleCollapse={cycleSidebar}
            verificationStage={verificationStage}
          />
        </div>
      )}
      {mobileOpen && (
        <div
          className="modal-backdrop-custom"
          style={{ justifyContent: "flex-start" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{ width: 230 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              active={active}
              setActive={(id) => {
                navigateFresh(id);
                setMobileOpen(false);
              }}
              onLogout={onLogout}
              passkeyEnabled={passkeyEnabled}
              collapsed={false}
              onToggleCollapse={() => {}}
              verificationStage={verificationStage}
            />
          </div>
        </div>
      )}
      <div
        className="flex-fill d-flex flex-column"
        style={{ minWidth: 0 }}
      >
        <TopMasthead
          onLogout={onLogout}
          onNav={navigateFresh}
          passkeyEnabled={passkeyEnabled}
          setPasskeyEnabled={setPasskeyEnabled}
          sidebarHidden={sidebarHidden}
          onToggleSidebar={cycleSidebar}
          active={active}
          verificationStage={verificationStage}
          setVerificationStage={setVerificationStage}
          builderUsers={builderUsers}
          demoLoggedInUserId={demoLoggedInUserId}
          setDemoLoggedInUserId={setDemoLoggedInUserId}
        />
        {currentUserFrozen && active !== "accessRevoked" && (
          <div className="verify-banner verify-banner-danger">
            <span>
              🚫 Your access has been revoked — your periodic review
              is overdue. Kindly contact your application
              administrator to request an extension. Most
              functionality (project/lead entry, and any other
              entry/update) is unavailable until then.
            </span>
          </div>
        )}
        {verificationStage === "incomplete" && (
          <div className="verify-banner verify-banner-danger">
            <span>
              ⚠ Complete your company's KYC details to unlock the
              Developer Portal. Until then, only Company Listing and
              your profile are available.
            </span>
            <button
              className="btn btn-navy btn-sm text-nowrap"
              onClick={() => setActive("companyEntry")}
            >
              Complete Now
            </button>
          </div>
        )}
        {verificationStage === "pending" && (
          <div className="verify-banner verify-banner-warning">
            <span>
              ⏳ Pending PAMS approval — you can update your one
              project lead and respond to queries. Full access
              unlocks once your company and account are approved.
            </span>
          </div>
        )}
        <div className="p-3 p-md-4 page-enter" key={active}>
          {screens[active]}
        </div>
      </div>
      <ChatbotWidget />
    </div>
  );
}

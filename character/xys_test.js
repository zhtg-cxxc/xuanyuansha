'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'xys_test',
		connect:true,
		character:{
		    //-----zhtg-----
			xy_test_yaohan:['male','shen',3,['xy_test_chewei']],
			xy_test_wuhaibin:['male','shen',3,['xy_test_yihuo'],['zhu']],
			xy_test_fangzihao:['male','shen',4,['xy_test_zhuanli']],
			xy_test_chenghao:['male','shen',4,['xy_test_jigeng','xy_test_tishen']],
			
			//-----bb------
			xy_test_wufengxing:['male','shen',3,['xy_test_xuanfu','xy_test_manfen'],['zhu']],
			//xy_test_qiuruiang:['male','shen',3,['xy_test_mengtu']],
			
		},
		characterTitle:{
		    //-----zhtg-----
		    xy_test_yaohan:"#r征求共研",
		    xy_test_wuhaibin:"#r征求共研",
		    xy_test_fangzihao:"#r征求共研",
		    xy_test_chenghao:"#r征求共研",
		    
		    //-----fzh------
			xy_test_wufengxing:'#b物理一定要学好',
			xy_test_qiuruiang:'#r征求共研'
		},
		characterIntro:{
		    //-----zhtg-----
		    xy_test_yaohan:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：防御、干扰。<br/><strong>共研重点</strong>：角色强度，与现有角色相比的优劣。",
		    xy_test_wuhaibin:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：辅助、控制。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。<br/><strong>该角色还需要更多技能，欢迎大家献计献策！</strong>",
		    xy_test_fangzihao:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：垄断（控制）、爆发。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。",
			xy_test_chenghao:"<strong>初稿设计</strong>：开发组 <a href='https://zhtg.red'>种花兔</a>；<br/><strong>预期定位</strong>：替身使者、爆发。<br/><strong>共研重点</strong>：角色强度，是否符合JOJO相关设定。",
			
			//-----bb------
			xy_test_wufengxing:"<strong>初稿设计</strong>：开发组 <a href='https://bbsblog.ftp.sh'>BB</a>；<br/><strong>预期定位</strong>：辅助、控制、爆发。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。",
			xy_test_qiuruiang:"<strong>初稿设计</strong>：开发组 <a href='https://bbsblog.ftp.sh'>BB</a>；<br/><strong>预期定位</strong>：辅助、干扰。<br/><strong>共研重点</strong>：角色强度，是否符合该角色现实人设。"
		},
		characterSort:{
			xys_test:{
				xy_test_dev:['xy_test_yaohan','xy_test_wuhaibin','xy_junguan','xy_test_fangzihao','xy_test_chenghao','xy_test_wufengxing','xy_test_qiuruiang'],
				xy_test_post:[],
			},
		},
		skill:{
		    //-----bb------
			xy_test_xuanfu:{
				//Unstable!!!Use as your own risk!
				audio:2,
				trigger:{player:'loseEnd'},
				init:function(player,skill){
					if(!player.storage[skill]) player.storage[skill]=1;
				},
				frequent:true,
				filter:function(event,player){
					if(player.countCards('h')) return false;
					for(var i=0;i<event.cards.length;i++){
						if(event.cards[i].original=='h') return true;
					}
					return false;
				},
				content:function(){
					var xuanfu=0;
					switch (player.storage.xy_test_xuanfu){
						case 1:{
							xuanfu=Math.floor(Math.random()*3+2);
							player.draw(xuanfu);
							game.log(player,'增加了',xuanfu,'张手牌');
							break;
							}
						case 2:{
							xuanfu=Math.floor(Math.random()*3+1);
							player.draw(xuanfu);
							game.log(player,'增加了',xuanfu,'张手牌');
							break;
							}
						case 3:{
							player.draw();
							game.log(player,'增加了一张手牌');
							break;
						}
						default:game.log('您已经没有多摸牌的机会了');
					}
					player.storage.xy_test_xuanfu++;
				},
				ai:{
					threaten:0.8,
					effect:{
						target:function(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
			},
		    xy_test_manfen:{
				//Unstable too!!!Use as your own risk!
				audio:2,
				trigger:{global:'damageEnd'},
				init:function(player,skill){
					if(!player.storage[skill]) player.storage[skill]=8;
				},
				filter:function(event,player){return event.player.maxHp>0&&event.player.maxHp-event.player.hp==1},
				content:function(){
				if(Math.random()*player.storage.xy_test_manfen<=6){
					trigger.player.recover();
					player.storage.xy_test_manfen++;
					}
				},
				ai:{
					threaten:0.8,
					effect:{
						target:function(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter:function(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
			},
			xy_test_mengtu:{
			
			},
		    //-----zhtg-----
		    xy_test_chewei:{
				audio:'jushou',
				group:['xy_test_chewei3'],
				trigger:{player:'phaseJieshuBegin'},
				content:function(){
					'step 0'
					player.draw(3);
					'step 1'
					player.chooseCard('h',true,'请选择一张手牌并弃置之，若你选择了一张装备牌则改为装备之。').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&!player.isDisabled(get.subtype(result.cards[0]))){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
					'step 3'
					player.turnOver();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
		    xy_test_chewei2:{
				trigger:{player:['damageBegin3','loseHpBefore','recoverBefore']},
				forced:true,
				popup:false,
				content:function(){
					trigger.cancel();
				},
				mod:{
					cardEnabled:function(){
						return false;
					},
					cardSavable:function(){
						return false;
					},
					targetEnabled:function(){
						return false;
					},
				},
				mark:true,
				intro:{
					content:'不计入距离的计算且不能使用牌且不是牌的合法目标且不能失去/回复体力和受到伤害'
				},
				group:'undist',
				ai:{
					effect:{
						target:function (card,player,target){
							if(get.tag(card,'recover')||get.tag(card,'damage')) return 'zeroplayertarget';
						},
					},
				},
			},
			xy_test_chewei3:{
			    trigger:{player:'turnOverAfter'},
			    forced:true,
			    content:function(){
			        if(player.isTurnedOver()){
			            player.addSkill('xy_test_chewei2');
			        }else{
			            player.removeSkill('xy_test_chewei2');
			        }
			    }
			},
			xy_test_hunge:{
			    
			},
			xy_test_yihuo:{
			    audio:'xy_test_yihuo',
			    chat:['死掉的人我可以医好他'],
				enable:'chooseToUse',
				filter:function(event,player){
					return event.type=='dying'&&event.dying&&!event.dying.isTurnedOver();
				},
				filterTarget:function(card,player,target){
					return target==_status.event.dying;
				},
				selectTarget:-1,
				content:function(){
				    player.chat(lib.skill.xy_test_yihuo.chat[0]);
					target.turnOver();
					target.recover();
					if(player!=target){
						game.asyncDraw([player,target]);
					}
					else{
						player.draw(2);
					}
				},
				ai:{
					order:0.1,
					skillTagFilter:function(player){
						if(!_status.event.dying||_status.event.dying.isTurnedOver()) return false;
					},
					save:true,
					result:{
						target:3,
						player:function(player){
							if(player.hp>1) return 1;
							return -1;
						},
					},
					threaten:1.6
				},
			},
			xy_test_jigeng:{
				audio:true,
				trigger:{player:'damageEnd'},
				forced:true,
				unique:true,
				group:'xy_test_jigeng2',
				notemp:true,
				//mark:true,
				filter:function(event){
					return event.num>0;
				},
				content:function(){
					player.addMark('xy_test_jigeng',trigger.num);
				},
				intro:{
					name2:'梗',
					content:'mark'
				},
				ai:{
					maixie:true,
					maixie_hp:true,
					effect:{
						target:function(card,player,target){
							if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
							if(get.tag(card,'damage')){
								if(target.hp==target.maxHp){
									if(!target.hasSkill('jilue')){
										return [0,1];
									}
									return [0.7,1];
								}
								return 0.7;
							}
						},
						player:function(card,player){
							if(_status.currentPhase!=player) return;
							if(_status.event.name!='chooseToUse'||_status.event.player!=player) return;
							if(get.type(card)=='basic') return;
							if(get.tag(card,'gain')) return;
							if(get.value(card,player,'raw')>=7) return;
							if(player.hp<=2) return;
						}
					}
				}
			},
			xy_test_jigeng2:{
				audio:true,
				trigger:{player:'discardAfter'},
				forced:true,
				filter:function(event){
					var evt=event.getParent('phaseDiscard');
					return evt&&evt.name=='phaseDiscard'
				},
				content:function(){
					player.addMark('xy_test_jigeng',trigger.cards.length);
				}
			},
			xy_test_tishen:{
				skillAnimation:'epic',
				animationColor:'thunder',
				juexingji:true,
				trigger:{player:'phaseZhunbeiBegin'},
				forced:true,
				unique:true,
				audio:true,
				derivation:[
				    "xy_test_ts_xgsq",
				    "xy_test_ts_ttzm",
				    "xy_test_ts_bjzx",
				    "xy_test_ts_fkzs",
				    "xy_test_ts_zdhh"
				],
				filter:function(event,player){
					return player.countMark('xy_test_jigeng')>=4;
				},
				content:function(){
					'step 0'
					player.loseMaxHp();
					player.chooseControl(get.translation("xy_test_ts_xgsq"),get.translation("xy_test_ts_ttzm"),get.translation("xy_test_ts_bjzx"),get.translation("xy_test_ts_fkzs"),get.translation("xy_test_ts_zdhh"),function(){
    					var randNum=Math.random();
    					if(randNum<0.25){
    					    return get.translation("xy_test_ts_ttzm");
    					}else if(randNum<0.5){
    					    return get.translation("xy_test_ts_bjzx");
    					}else if(randNum<0.75){
    					    return get.translation("xy_test_ts_fkzs");
    					}else{
    					    return get.translation("xy_test_ts_zdhh");
    					}
					}).set('prompt',get.prompt('xy_test_tishen')).set('choiceList',[
						get.translation("xy_test_ts_xgsq_info"),
						get.translation("xy_test_ts_ttzm_info"),
						get.translation("xy_test_ts_bjzx_info"),
						get.translation("xy_test_ts_fkzs_info"),
						get.translation("xy_test_ts_zdhh_info")
					]);
					'step 1'
					player.awakenSkill('xy_test_tishen');
					if(result.control==get.translation("xy_test_ts_xgsq")){
					    player.addSkill("xy_test_ts_xgsq");
					}else if(result.control==get.translation("xy_test_ts_ttzm")){
					    player.addSkill("xy_test_ts_ttzm");
					}else if(result.control==get.translation("xy_test_ts_bjzx")){
					    player.addSkill("xy_test_ts_bjzx");
					}else if(result.control==get.translation("xy_test_ts_fkzs")){
					    player.addSkill("xy_test_ts_fkzs");
					}else if(result.control==get.translation("xy_test_ts_zdhh")){
					    player.addSkill("xy_test_ts_zdhh");
					}
				}
			},
			/*xy_test_ts_xgsq:{
				skillAnimation:true,
				animationColor:'wood',
				audioname:['heqi'],
				mark:true,
				trigger:{player:'useCardToPlayered'},
				//priority:5,
				filter:function(event,player){
					if(event.getParent().triggeredTargets3.length>1) return false;
					if(get.info(event.card).multitarget) return false;
					console.log(get.name(event.card));
					if(get.type(event.card)!='trick'&&get.name(event.card)!="sha") return false;
					if(!player.countMark('xy_test_jigeng')) return false;
					return true;
				},
				direct:true,
				content:function(){
					"step 0"
					var ccard = trigger.card;
					player.chooseTarget(get.prompt('xy_test_ts_xgsq'),
						//[1,Math.min(game.players.length,player.countMark('xy_test_jigeng'))],function(card,player,target){
						[1,game.players.length],function(card,player,target){
						console.log(ccard,target);
						return player.canUse(ccard,target);
						//var evt=_status.event.getTrigger().getParent();
						//return evt.targets.contains(target)&&!evt.excluded.contains(target);
					}).set('ai',function(target){
						var trigger=_status.event.getTrigger();
						if(game.phaseNumber>game.players.length*2&&trigger.targets.length>=game.players.length-1){
							if(evt.targets.contains(target)&&!evt.excluded.contains(target)){
							    return -get.effect(target,trigger.card,trigger.player,_status.event.player);
							}else{
							    return get.effect(target,trigger.card,trigger.player,_status.event.player);
							}
						}
						return -1;
					});
					"step 1"
					if(result.bool){
						player.awakenSkill('xy_test_ts_xgsq');
						player.logSkill('xy_test_ts_xgsq',result.targets);
						trigger.getParent().excluded.addArray(result.targets);
						game.delay();
					}
				}
			},*/
			xy_test_ts_xgsq:{
				audio:true,
				//trigger:{player:'useCard1'},
				//firstDo:true,
				enable:'phaseUse',
				group:['xy_test_ts_xgsq4'],
				filter:function(event,player){
					/*if(event.card.name!='sha') return false;
					var card=event.card;
					var range;
					var select=get.copy(get.info(card).selectTarget);
					if(select==undefined){
						if(get.info(card).filterTarget==undefined) return false;
						range=[1,1];
					}
					else if(typeof select=='number') range=[select,select];
					else if(get.itemtype(select)=='select') range=select;
					else if(typeof select=='function') range=select(card,player);
					game.checkMod(card,player,range,'selectTarget',player);*/
				    return player.countMark('xy_test_jigeng');
				},
				content:function(){
				    "step 0"
					var map={};
					var list=[];
					for(var i=0;i<=Math.min(player.countMark('xy_test_jigeng'),game.players.length-2);i++){
						var cn=get.cnNumber(i,true);
						map[cn]=i;
						list.push(cn);
					}
					event.map=map;
					player.chooseControl(list,function(){
						return '零';
					}).set('prompt','性感手枪：请选择消耗“梗”（增加目标）的数目：');
					"step 1"
					player.storage.xy_test_ts_xgsq+=event.map[result.control];
					player.removeMark('xy_test_jigeng',player.storage.xy_test_ts_xgsq);
					player.addSkill('xy_test_ts_xgsq2');player.addSkill('xy_test_ts_xgsq3');
				},
			},
			xy_test_ts_xgsq2:{
				mod:{
					selectTarget:function(card,player,range){
						if(card.name!='sha') return;
						if(range[1]==-1) return;
						range[1]+=player.storage.xy_test_ts_xgsq;
					}
				}
			},
			xy_test_ts_xgsq3:{
				trigger:{
					player:'useCardAfter',
				},
				forced:true,
			    filter:function(event,player){
					return get.name(event.card)=="sha";
				},
				content:function(){
				    player.removeSkill('xy_test_ts_xgsq2');
				    player.removeSkill('xy_test_ts_xgsq3');
				    player.storage.xy_test_ts_xgsq=0;
				}
			},
			xy_test_ts_xgsq4:{
				trigger:{source:'damageBefore'},
				forced:true,
				audio:2,
				//priority:16,
				check:function(){return false;},
				content:function(){
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai:{
					jueqing:true
				}
			},
			xy_test_ts_ttzm:{
			    enable:'phaseUse',
				audio:0,
				filterTarget:function(card,player,target){
					if(player==target) return false;
					if(!player.countMark('xy_test_jigeng')||player.countMark('xy_test_jigeng')<2)return false;
					if (get.mode()=='guozhan') return (target.countCards('h')||target.isUnseen(2));
					else if (get.mode()=='identity') return (!target.identityShown||target.countCards('h'));
					else return (target.countCards('h'));
				},
				content:function(){
					"step 0"
					player.removeMark('xy_test_jigeng',2);
					if(!player.storage.xy_test_ts_ttzm){
						player.storage.xy_test_ts_ttzm=[];
					}
					player.storage.xy_test_ts_ttzm.add(target);
					var controls=[];
					if(target.countCards('h')) controls.push('手牌');
					if(get.mode()=='guozhan'){
    					if(target.isUnseen(0)) controls.push('主将');
    					if(target.isUnseen(1)) controls.push('副将');
					}else if(get.mode()=='identity'){
					    controls.push('身份');
					}
					if(controls.length>1){
						player.chooseControl(controls);
					}
					if(controls.length==0) event.finish();
					"step 1"
					var content;
					var str=get.translation(target)+'的';
					if(result.control){
						if(result.control=='手牌'){
							content=[str+'手牌',target.getCards('h')];
							game.log(player,'观看了',target,'的手牌');
						}
						else if(result.control=='主将'){
							content=[str+'主将',[[target.name1],'character']];
							game.log(player,'观看了',target,'的主将');
						}
						else if(result.control=='副将'){
							content=[str+'副将',[[target.name2],'character']];
							game.log(player,'观看了',target,'的副将');
						}
						else{
							content=[str+'身份',get.translation(target.identity)];
							game.log(player,'观看了',target,'的身份');
						}
					}
					else if(target.countCards('h')){
						content=[str+'手牌',target.getCards('h')];
						game.log(player,'观看了',target,'的手牌');
					}
					else if(get.mode()=='guozhan'){
					    if(target.isUnseen(0)){
    						content=[str+'主将',[[target.name1],'character']];
    						game.log(player,'观看了',target,'的主将');
    					}
    					else{
    						content=[str+'副将',[[target.name2],'character']];
    						game.log(player,'观看了',target,'的副将');
    					}
					}else{
						content=[str+'身份',get.translation(target.identity)];
						game.log(player,'观看了',target,'的身份');
					}
					player.chooseControl('ok').set('dialog',content);
				},
				ai:{
					order:9.5,
					wuxie:function(){
						return 0;
					},
					result:{
						player:function(player,target){
							if(player.countCards('h')<=player.hp) return 0;
							if(player.storage.xy_test_ts_ttzm&&player.storage.xy_test_ts_ttzm.contains(target)) return 0;
							return target.isUnseen()?1:0;
						}
					}
				}
			},
			xy_test_ts_bjzx:{
				trigger:{global:'phaseEnd'},
				popup:false,
				audio:false,
				priority:10,
				filter:function(event,player){
				    if (player.hasSkill('xy_test_ts_bjzx2')) return false;
				    return player.countMark('xy_test_jigeng')>=3;
				},
				content:function(){
					"step 0"
					player.removeMark('xy_test_jigeng',3);
					"step 1"
					event.xy_bool=false;
					event.xy_str = "进行一个额外回合";
				    if (player.countMark('xy_test_jigeng')){
				        player.chooseBool('是否消耗额外的一个“梗”标记以使令其他玩家在该回合内不能使用或打出牌，且非锁定技失效？').ai=function(){
    						return true;
    					};
				    }
					"step 2"
					if (result.bool && player.countMark('xy_test_jigeng')){
				        event.xy_bool=true;
				        event.xy_str=event.xy_str+"，其他玩家在该回合内不能使用或打出牌，且非锁定技失效。";
				    }else{
				        event.xy_str=event.xy_str+"。";
				    }
					"step 3"
					player.markSkillCharacter('xy_test_ts_bjzx',player,'白金之心',event.xy_str);
					if(event.xy_bool){
					    player.addSkill('xy_test_ts_bjzx3');
					    player.removeMark('xy_test_jigeng',1);
					}
					player.addSkill('xy_test_ts_bjzx5');
					player.insertPhase();
				}
			},
			xy_test_ts_bjzx2:{
				trigger:{player:['phaseAfter','phaseCancelled']},
				forced:true,
				popup:false,
				audio:false,
				priority:5,
				content:function(){
					player.unmarkSkill('xy_test_ts_bjzx');
					player.removeSkill('xy_test_ts_bjzx2');
				}
			},
			xy_test_ts_bjzx3:{
				trigger:{player:['phaseBegin']},
				forced:true,
				audio:false,
				priority:5,
				content:function(){
				    "step 0"
				    event.current=player.next;
					event.currented=[];
				    "step 1"
					event.currented.push(event.current);
					if(!event.current.hasSkill('fengyin')){
						event.current.addTempSkill('fengyin');
					}
					event.current.addTempSkill('xy_test_ts_bjzx4');
					event.current=event.current.next;
					"step 2"
					if(event.current!=player&&!event.currented.contains(event.current)){
						game.delay(0.5);
						event.goto(1);
					}
					"step 3"
					player.removeSkill('xy_test_ts_bjzx3');
				}
			},
			xy_test_ts_bjzx4:{
				mark:true,
				mod:{
					cardEnabled:function(){
						return false;
					},
					cardUsable:function(){
						return false;
					},
					cardRespondable:function(){
						return false;
					},
					cardSavable:function(){
						return false;
					}
				},
				intro:{
					content:'不能使用或打出卡牌'
				}
			},
			xy_test_ts_bjzx5:{
				trigger:{player:['phaseBegin']},
				forced:true,
				audio:false,
				priority:500,
				content:function(){
				    player.addSkill('xy_test_ts_bjzx2');
					player.removeSkill('xy_test_ts_bjzx5');
				}
			},
			xy_test_ts_fkzs:{
				trigger:{global:['phaseEnd']},
				audio:false,
				filter:function(event,player){
				    return player.countMark('xy_test_jigeng')>=4;
				},
				content:function(){
				    player.removeMark('xy_test_jigeng',4);
				    _status.currentPhase.recover(Math.min(3,_status.currentPhase.maxHp-_status.currentPhase.hp));
				    if(_status.currentPhase.isTurnedOver())_status.currentPhase.turnOver();
				    _status.currentPhase.draw(Math.min(0,4-_status.currentPhase.countCards("h")));
				},
				ai:{
					order:9.5,
					result:{
						player:function(event,player){
							if(_status.currentPhase.maxHp-_status.currentPhase.hp>=3) return 5;
							if(_status.currentPhase.countCards("h")<4) return -0.5;
							return -1;
						}
					}
				}
			},
			xy_test_ts_zdhh:{
			    enable:'phaseUse',
				audio:0,
				group:['xy_test_ts_zdhh1'],
				init:function(player){
					player.storage.xy_test_ts_zdhh=[];
				},
				filterTarget:function(card,player,target){
					if(!player.countMark('xy_test_jigeng')||player.countMark('xy_test_jigeng')<5)return false;
					return !player.storage.xy_test_ts_zdhh.contains(target);
				},
				content:function(){
					player.removeMark('xy_test_jigeng',5);
					player.storage.xy_test_ts_zdhh.push(target);
				},
				ai:{
					result:{
					    target:-5
					}
				}
			},
			xy_test_ts_zdhh1:{
			    trigger:{global:'damageBefore'},
				audio:0,
				forced:true,
				filter:function(event,player){
				    if(event.parent.name=='xy_test_ts_zdhh1')return false;
				    if(event.parent.name=='xy_test_ts_zdhh1'&&event.parent.parent.name=='xy_test_ts_zdhh1')return false;
					return player.storage.xy_test_ts_zdhh.contains(event.player);
				},
				content:function(){
				    "step 0"
				    player.storage.xy_test_ts_zdhh1=[trigger.player];
				    if (trigger.source){
				        player.storage.xy_test_ts_zdhh1.push(trigger.source);
				    }
					player.chooseTarget("请选择杀手皇后的目标",true,function(card,player,target){
						return player.storage.xy_test_ts_zdhh1.contains(target);
					}).ai=function(player,target){
						var num=target.maxHp - target.hp;
						var att=get.attitude(player,target);
						return num*att;
					};
				    "step 1"
				    var target=result.targets[0];
				    player.storage.xy_test_ts_zdhh1=[];
				    player.line(target,'fire');
					player.logSkill('xy_test_ts_zdhh',target);
					target.damage(3,'fire',player);
				    "step 2"
					for(var i=0;i<player.storage.xy_test_ts_zdhh.length;i++){
					    if(player.storage.xy_test_ts_zdhh[i]==trigger.player){
					        player.storage.xy_test_ts_zdhh.splice(i,1);
					        break;
					    }
					}
				}
			},
			xy_test_zhuanli:{
			    mark:true,
				intro:{
				    title:"专利局",
					content:function(storage,player){
						var str='';
						if(player.storage.xy_test_zhuanli1.length){
						    str=get.translation(player)+'已对下列牌申请专利：<br/>';
    						for(var i=0;i<player.storage.xy_test_zhuanli1.length;i++){
    						    str = str + "【"+ get.translation(player.storage.xy_test_zhuanli1[i]) +"】<br/>";
    						}
						}else{
						    str=get.translation(player)+'还未申请任何专利。<br/>';
						}
						if(player.storage.xy_test_zhuanli2.length){
						    str=str + get.translation(player)+'无法对下列牌申请专利：<br/>';
    						for(var i=0;i<player.storage.xy_test_zhuanli2.length;i++){
    						    str = str + "【"+ get.translation(player.storage.xy_test_zhuanli2[i]) +"】<br/>";
    						}
						}else{
						    str=str + get.translation(player)+'可以对任何牌申请专利。<br/>';
						}
						return str;
					}
				},
			    group:['xy_test_zhuanli1','xy_test_zhuanli2','xy_test_zhuanli3'],
			    init:function(player){
					player.storage.xy_test_zhuanli1=[];//已申请专利数组
					player.storage.xy_test_zhuanli2=[];//无法申请专利数组
				},
				trigger:{
					player:['useCardAfter','respondAfter'],
				},
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
					return (player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))==-1 && 
					    player.storage.xy_test_zhuanli2.indexOf(get.name(event.card))==-1);
				},
				direct:true,
				content:function(){
					"step 0"
					trigger.player.chooseToDiscard('<center><strong>专利局温馨提示</strong></center><br/>您可以弃置一张牌以对你使用的【'+get.translation(trigger.card)+'】申请专利，你想要这么做吗？',function(card){
						return true;
					}).set('ai',function(card){
							return 10-get.value(card);
					});
					"step 1"
					if(result.bool){
			            player.storage.xy_test_zhuanli1.push(trigger.card.name);
						game.log('<span class="bluetext">专利局</span>声明：',player,"对",trigger.card,"申请专利，使用或打出该牌需要向",player,"付专利费。");
					}else{
			            player.storage.xy_test_zhuanli2.push(trigger.card.name);
					    game.log('<span class="bluetext">专利局</span>声明：',player,"放弃对",trigger.card,"申请专利。");
					}
				},
			},
			xy_test_zhuanli1:{
				trigger:{global:'useCard'},
				priority:2,
				forced:true,
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(player.storage.xy_test_zhuanli1.indexOf(get.name(event.card)));
					return player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))!=-1;
				},
				content:function(){
			        "step 0"
				    var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
					trigger.player.chooseCard('<center><strong>专利局温馨提示</strong></center><br/>将一张牌交给'+get.translation(player)+'，否则【'+get.translation(trigger.card)+'】将无效').set('ai',function(card){
						if(_status.event.eff>0){
							return 10-get.value(card);
						}
						return 0;
				    }).set('eff',eff);;
					"step 1"
					if(result.bool){
					    game.log(trigger.player,"对",trigger.card,"向",player,"支付专利费。");
						player.gain(result.cards[0],trigger.player);
						trigger.player.$give(1,player);
					}else{
					    game.log(trigger.player,"拒绝对",trigger.card,"向",player,"支付专利费。");
				        trigger.cancel();
				    }
				}
			},
			xy_test_zhuanli2:{
				trigger:{global:['useCard','respond']},
				priority:1,
				forced:true,
				filter:function(event,player){
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(get.name(event.card));
					return (player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))==-1 && 
					    player.storage.xy_test_zhuanli2.indexOf(get.name(event.card))==-1);
				},
				content:function(){
			        player.storage.xy_test_zhuanli2.push(trigger.card.name);
			        game.log('<span class="bluetext">专利局</span>声明：',player,"无权对",trigger.card,"申请专利。");
				}
			},
			xy_test_zhuanli3:{
				trigger:{global:'useCardToTarget'},
				priority:2,
				forced:true,
				filter:function(event,player){
				    console.log(event);
				    if(get.type(event.card)=="equip")return false;
				    if (event.player==player) return false;
				    console.log(player.storage.xy_test_zhuanli1.indexOf(get.name(event.card)));
					return player.storage.xy_test_zhuanli1.indexOf(get.name(event.card))!=-1;
				},
				content:function(){
				    console.log(trigger);
			        "step 0"
				    var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
					trigger.player.chooseCard('<center><strong>专利局温馨提示</strong></center><br/>将一张牌交给'+get.translation(player)+'，否则【'+get.translation(trigger.card)+'】将无效').set('ai',function(card){
						if(_status.event.eff>0){
							return 10-get.value(card);
						}
						return 0;
				    }).set('eff',eff);;
					"step 1"
					if(result.bool){
					    game.log(trigger.player,"对",trigger.card,"向",player,"支付专利费。");
						player.gain(result.cards[0],trigger.player);
						trigger.player.$give(1,player);
					}else{
					    game.log(trigger.player,"拒绝对",trigger.card,"向",player,"支付专利费。");
				        trigger.directHit.addArray([trigger.player]);
				    }
				    console.log(trigger);
				}
			},
			/*xy_test_wuqiu:{
				enable:'phaseUse',
				audio:true,
				derivation:[
				    "xy_test_wuqiu1",
				    "xy_test_wuqiu2",
				    "xy_test_wuqiu3",
				    "xy_test_wuqiu4",
				    "xy_test_wuqiu5"
				],
				filter:function(event,player){
					return player.countMark('xy_test_jigeng')>=4;
				},
				content:function(){
					'step 0'
					player.loseMaxHp();
					player.chooseControl(get.translation("xy_test_ts_xgsq"),get.translation("xy_test_ts_ttzm"),get.translation("xy_test_ts_bjzx"),get.translation("xy_test_ts_fkzs"),get.translation("xy_test_ts_zdhh"),function(){
    					var randNum=Math.random();
    					if(randNum<0.25){
    					    return get.translation("xy_test_ts_ttzm");
    					}else if(randNum<0.5){
    					    return get.translation("xy_test_ts_bjzx");
    					}else if(randNum<0.75){
    					    return get.translation("xy_test_ts_fkzs");
    					}else{
    					    return get.translation("xy_test_ts_zdhh");
    					}
					}).set('prompt',get.prompt('xy_test_tishen')).set('choiceList',[
						get.translation("xy_test_ts_xgsq_info"),
						get.translation("xy_test_ts_ttzm_info"),
						get.translation("xy_test_ts_bjzx_info"),
						get.translation("xy_test_ts_fkzs_info"),
						get.translation("xy_test_ts_zdhh_info")
					]);
					'step 1'
					player.awakenSkill('xy_test_tishen');
					if(result.control==get.translation("xy_test_ts_xgsq")){
					    player.addSkill("xy_test_ts_xgsq");
					}else if(result.control==get.translation("xy_test_ts_ttzm")){
					    player.addSkill("xy_test_ts_ttzm");
					}else if(result.control==get.translation("xy_test_ts_bjzx")){
					    player.addSkill("xy_test_ts_bjzx");
					}else if(result.control==get.translation("xy_test_ts_fkzs")){
					    player.addSkill("xy_test_ts_fkzs");
					}else if(result.control==get.translation("xy_test_ts_zdhh")){
					    player.addSkill("xy_test_ts_zdhh");
					}
				}
			},*/
		},
		translate:{
		    /********Character*******/
		    //-----zhtg-----
		    xy_test_yaohan:"研姚涵",
		    xy_test_wuhaibin:"研吴海斌",
		    xy_test_fangzihao:"研方梓豪",
		    xy_test_chenghao:"研程浩",
		    
		    //-----bb------
			xy_test_wufengxing:"研吴凤星",
			xy_test_qiuruiang:"研仇瑞昂",
		    
		    /********Categories*******/
		    xy_test_post:"网友投稿",
		    xy_test_dev:"开发组公测",
		    
		    /********Skills*******/
		    //-----bb------
			xy_test_xuanfu:"炫富",
			xy_test_xuanfu_info:"假如你失去了最后一张手牌，第一次你可以摸2~4张手牌，第二次可以摸1~3张手牌，第三次可以摸一张手牌",
			xy_test_manfen:"满分",
			xy_test_manfen_info:"当一名角色仅失去一点体力时，你有几率可以恢复其体力，但每一次使用过后恢复的几率会下降",
			xy_test_mengtu:"萌图",
			xy_test_mengtu_info:"working...",
		    
		    //-----zhtg-----
		    xy_test_chewei:"车位",
		    xy_test_chewei2:"车位",
		    xy_test_chewei3:"车位",
		    xy_test_chewei_info:"结束阶段，你可以获得三张牌并弃置一张手牌，若你选择了一张装备牌，则改为使用之，然后你将你的武将牌翻面；锁定技，当你处于翻面状态时，不计入距离的计算且不能使用牌且不是牌的合法目标且不能失去或回复体力或受到伤害。",
		    xy_test_hunge:"魂歌",
		    xy_test_hunge_info:"【这个技能我还没想好丫】吴老师总喜欢在地理课前放一些灵魂歌手唱的关于地理的歌……",
		    xy_test_yihuo:"医活",
		    xy_test_yihuo_info:"当一名未翻面的角色进入濒死状态时，你可以令其翻面并回复一点体力，然后你与其各摸一张牌",
			xy_test_jigeng:"集梗",
			xy_test_jigeng2:"集梗",
			xy_test_jigeng_info:"锁定技，当你受到1点伤害后，你获得一枚“梗”标记；锁定技，当你于弃牌阶段内弃置牌后，你获得等同于失去的牌数量的“梗”标记。",
			xy_test_tishen:"替身",
			xy_test_tishen_info:"觉醒技，准备阶段开始时，若你的“梗”标记数不小于4，你减1点体力上限，然后选择获得【性感手枪】、【天堂之门】、【白金之星】、【疯狂钻石】、【杀手皇后】中的一个技能（替身）。",
			xy_test_ts_xgsq:"性感手枪",xy_test_ts_xgsq2:"性感手枪",xy_test_ts_xgsq3:"性感手枪",xy_test_ts_xgsq4:"性感手枪",
			//xy_test_ts_xgsq_info:"出牌阶段，你可以消耗X点“梗”标记使你使用的下一张【杀】可多指定X个目标；每当你使用一张【杀】时，你可以消耗Y（等同于指定目标数）的“梗”标记使该【杀】无法被响应；每当你造成一次伤害后，你可以消耗1个“梗”标记使该伤害+1。",
			xy_test_ts_xgsq_info:"锁定技，你造成的伤害视为流失体力。；出牌阶段，你可以消耗X点“梗”标记使你使用的下一张【杀】可多指定X个目标。",
			xy_test_ts_ttzm:"天堂之门",
			xy_test_ts_ttzm_info:"出牌阶段，你可以消耗2个“梗”标记以查看一名角色的身份（国战模式下为该角色的主将或副将）或手牌。"/*，若你选择观看手牌，则你可以用自己的一张手牌替换其中的一张牌*/,
			xy_test_ts_bjzx:"白金之心",xy_test_ts_bjzx2:"白金之心",xy_test_ts_bjzx3:"白金之心",xy_test_ts_bjzx4:"白金之心",
			xy_test_ts_bjzx_info:"一名角色的结束阶段开始时，你可以消耗3个“梗”标记并获得一个额外回合；你可额外消耗1个“梗”令其他玩家在该回合内不能使用或打出牌，且非锁定技失效。你不能在该额外的回合内施放此技能。",
			xy_test_ts_fkzs:"疯狂钻石",
			xy_test_ts_fkzs_info:"任意角色的结束阶段时，你可以消耗4个“梗”标记以将其体力值补充至体力上限（最多变化3点），重置该角色并使其翻回正面，然后将其手牌补至4张。",
			xy_test_ts_zdhh:"杀手皇后",
			xy_test_ts_zdhh_info:"出牌阶段，你可以消耗5个“梗”标记并指定一名没有“炸”标记的玩家获得一枚“炸”标记（指定后不可见），有“炸”标记的玩家受到非“杀手皇后”造成的伤害时，你可让该玩家或伤害来源受到3点火焰伤害（先结算“杀手皇后”造成的伤害），然后移去“炸”标记。",
			xy_test_zhuanli:"专利",xy_test_zhuanli1:"专利",xy_test_zhuanli3:"专利",
			xy_test_zhuanli_info:"锁定技，每当你使用或打出一张非装备牌之后，若你是本轮游戏第一个使用或打出该牌的角色，你可以选择弃置一张牌已对其申请专利；若其他角色使用或打出了你已经申请专利的牌之后，其需选择将一张牌交给你，否则该牌无效。",
		},
	};
});
